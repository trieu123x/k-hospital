"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Table } from "@/components/ui/Table";
import { appointmentApi } from "@/routers/appointment/appointmentRouter";

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "20%" },
  { key: "phone", label: "Số điện thoại", width: "15%" },
  { key: "email", label: "Email", width: "20%" },
  { key: "Day", label: "Ngày khám", width: "15%" },
  { key: "Shift", label: "Ca khám", width: "15%" },
  { key: "Status", label: "Xác nhận", width: "15%", mode: "tick" },
];

export default function Appointments() {
  const params = useParams();
  const doctorId = params?.uuid; 

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");

  const fetchPendingAppointments = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await appointmentApi.getDoctorSchedule(doctorId);
      if (res && res.success) {
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
  }, [doctorId]);

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
        email: "an********@gmail.com", 
        Day: dateObj.toLocaleDateString("vi-VN"),
        Shift: `Ca ${app.shift}`,
        Status: false, 
        originalData: app 
      };
    });
  }, [records, dateFilter, shiftFilter]);

  const handleConfirmAllFiltered = async () => {
    if (displayedData.length === 0) {
      alert("Không có lịch nào phù hợp với bộ lọc để xác nhận!");
      return;
    }

    const confirmMsg = `Bạn có chắc chắn muốn XÁC NHẬN ${displayedData.length} lịch khám đang hiển thị trên màn hình?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await Promise.all(
        displayedData.map(app => 
          appointmentApi.updateAppointmentStatus(app.id, { status: "CONFIRMED" })
        )
      );
      alert("Đã xác nhận hàng loạt thành công!");
      fetchPendingAppointments(); 
    } catch (error) {
      console.error("Lỗi khi xác nhận lịch:", error);
      alert("Đã có lỗi xảy ra. Một số lịch có thể chưa được xác nhận.");
    }
  };

  const handleTick = async (isChecked, rowData) => {
    if (isChecked && rowData?.id) {
      
      const confirmMsg = `Xác nhận lịch khám cho bệnh nhân ${rowData.name}?`;
      if (!window.confirm(confirmMsg)) {
        fetchPendingAppointments(); 
        return;
      }

      try {
        await appointmentApi.updateAppointmentStatus(rowData.id, { status: "CONFIRMED" });
        alert(`Đã xác nhận lịch cho ${rowData.name}!`);
        fetchPendingAppointments(); 
        
      } catch (error) {
        console.error("Lỗi khi xác nhận lịch:", error);
        const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi xác nhận lịch khám.";
        alert(errorMessage);
        fetchPendingAppointments(); 
      }
    }
  };

  return (
    <div className="grow flex flex-col rasa-font bg-white min-h-screen">
      
      <div className="flex h-[80px] px-10 items-center justify-between border-b border-gray-100">
        
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 flex-none text-gray-700" />
          <h1 className="mr-2 text-[18px] font-bold flex-none">Bộ lọc:</h1>
          
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 outline-none text-[14px] bg-white text-gray-700 cursor-pointer"
          >
            <option value="">Ngày đăng ký</option>
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
            <option value="">Ca đăng ký</option>
            {uniqueShifts.map(s => <option key={s} value={s}>Ca {s}</option>)}
          </select>
        </div>

        <button 
          onClick={handleConfirmAllFiltered}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full text-[14px] font-medium transition-colors"
        >
          Xác nhận hàng loạt
        </button>

      </div>

      <div className="px-10 pt-6 pb-4 flex-1">
        {loading ? (
          <div className="text-center py-10 italic text-gray-500">Đang tải danh sách chờ xác nhận...</div>
        ) : (
          <Table 
            columns={TABLE_COLUMNS} 
            data={displayedData}
            onTick={handleTick}
            className="max-h-[600px] border border-gray-200"
            headerClassName="bg-[#4066FF]"
            rowClassName="even:bg-[#F9F9F9] odd:bg-white" 
          />
        )}
      </div>

    </div>
  );
}