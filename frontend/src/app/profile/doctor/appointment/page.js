"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { appointmentApi } from "@/routers/appointment/appointmentRouter";
import { useAuthStore } from "@/stores/auth";
import { useGlobalLoading } from "@/stores/globalLoading";

const TABLE_COLUMNS = [
  { key: "name", label: "Tên bệnh nhân", width: "20%" },
  { key: "phone", label: "Số điện thoại", width: "15%" },
  { key: "Day", label: "Ngày khám", width: "15%" },
  { key: "Shift", label: "Ca khám", width: "10%" },
  { key: "reason", label: "Lý do thăm khám", width: "25%" },
  { key: "Status", label: "Xác nhận", width: "15%", mode: "tick" },
];

export default function Appointments() {
  const { user, isDoctor } = useAuthStore();
  const doctorId = user?.id;

  const [records, setRecords] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  const fetchPendingAppointments = async () => {
    if (!doctorId || !isDoctor) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await appointmentApi.getDoctorSchedule(doctorId);
      if (res && res.success) {
        setAllAppointments(res.data);
        // Chỉ lấy lịch PENDING — chờ bác sĩ xác nhận
        const pendingApps = res.data.filter(app => app.status === "PENDING");
        setRecords(pendingApps);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, [doctorId, isDoctor]);

  const uniqueDates = [...new Set(records.map(r => r.date))];
  const uniqueShifts = [...new Set(records.map(r => r.shift))].sort((a, b) => a - b);

  const displayedData = useMemo(() => {
    let filtered = records;

    if (dateFilter) filtered = filtered.filter(r => r.date === dateFilter);
    if (shiftFilter) filtered = filtered.filter(r => r.shift.toString() === shiftFilter.toString());

    return filtered.map(app => {
      const dateObj = new Date(app.date);
      return {
        id: app.appointmentId,
        name: app.patient?.name || "Bệnh nhân ẩn danh",
        phone: app.patient?.phone || "---",
        Day: dateObj.toLocaleDateString("vi-VN"),
        Shift: `Ca ${app.shift}`,
        reason: app.reason || "Không có lý do",
        Status: false, // Luôn false vì đây là PENDING
        originalData: app
      };
    });
  }, [records, dateFilter, shiftFilter]);

  const { showLoading, hideLoading } = useGlobalLoading();

  const handleTick = async (isChecked, rowData) => {
    if (!isChecked || !rowData?.id) return;

    // 1. Tính tổng số ca khám cùng ngày và cùng ca khám (shift) đã được xác nhận (CONFIRMED)
    const targetDateString = new Date(rowData.originalData.date).toDateString();
    const confirmedCount = allAppointments.filter(app => 
      app.status === "CONFIRMED" && 
      new Date(app.date).toDateString() === targetDateString && 
      app.shift === rowData.originalData.shift
    ).length;

    const totalAfterConfirm = confirmedCount + 1;

    let proceed = false;
    if (totalAfterConfirm >= 5) {
      proceed = window.confirm(
        `Cảnh báo: Hiện bạn đang có ${confirmedCount} ca khám đã xác nhận trước đó ở Ca ${rowData.originalData.shift} ngày ${rowData.Day}. Nếu xác nhận thêm ca khám này nữa thì có thể sẽ quá tải. Bạn có chắc chắn muốn xác nhận không?`
      );
    } else {
      const confirmMsg = `Xác nhận lịch khám ${rowData.Shift} ngày ${rowData.Day} cho bệnh nhân ${rowData.name}?`;
      proceed = window.confirm(confirmMsg);
    }

    if (!proceed) {
      // Ép Component render lại cục bộ để reset checkbox về false (do Status luôn là false)
      setRecords(prev => [...prev]);
      return;
    }

    showLoading("Đang xử lý yêu cầu...");
    try {
      await appointmentApi.updateAppointmentStatus(rowData.id, { status: "CONFIRMED" });
      
      // Xóa khỏi danh sách PENDING
      setRecords(prev => prev.filter(r => r.appointmentId !== rowData.id));
      
      // Cập nhật trạng thái trong allAppointments
      setAllAppointments(prev => 
        prev.map(app => 
          app.appointmentId === rowData.id ? { ...app, status: "CONFIRMED" } : app
        )
      );

      alert(`✅ Đã xác nhận lịch khám cho ${rowData.name}! Lịch sẽ xuất hiện trong "Yêu cầu chưa hoàn tất".`);
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xác nhận lịch khám.";
      alert(`Xác nhận thất bại: ${errorMessage}`);
      fetchPendingAppointments();
    } finally {
      hideLoading();
    }
  };

  if (!doctorId && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        Vui lòng đăng nhập với tài khoản bác sĩ để xem lịch trình.
      </div>
    );
  }

  if (!isDoctor && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-500 font-bold text-xl mb-2">Truy cập bị từ chối!</p>
        <p className="text-gray-500">Trang này chỉ dành cho Bác sĩ quản lý lịch khám.</p>
      </div>
    );
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white">

      <div className="flex h-[80px] px-10 items-center justify-between">

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 flex-none text-gray-700" />
          <h1 className="mr-2 text-[18px] font-bold flex-none">Bộ lọc:</h1>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 outline-none text-[14px] bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Tất cả ngày</option>
            {uniqueDates.map(d => (
              <option key={d} value={d}>
                {new Date(d).toLocaleDateString("vi-VN")}
              </option>
            ))}
          </select>

          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 outline-none text-[14px] bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Tất cả ca</option>
            {uniqueShifts.map(s => <option key={s} value={s}>Ca {s}</option>)}
          </select>

          <span className="text-[13px] italic text-gray-400 ml-1">
            {displayedData.length} yêu cầu chờ xác nhận
          </span>
        </div>
      </div>

      <div className="px-10 flex-1">
        <Table
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={displayedData}
          onTick={handleTick}
          className="max-h-[600px] border border-gray-200"
          headerClassName="bg-[#4066FF]"
          rowClassName="even:bg-[#F9F9F9] odd:bg-white"
        />
      </div>

    </div>
  );
}