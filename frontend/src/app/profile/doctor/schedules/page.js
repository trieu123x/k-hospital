"use client";

import { useState, useEffect, useMemo } from "react";
import { ShiftItem } from "@/components/appointment/doctor/shiftItem";
import { appointmentApi } from "@/routers/appointment/appointmentRouter";
import { CalendarSidebar } from "@/components/appointment/doctor/calendarItem";
import { ConfirmModal } from "@/components/ui/Modal"; 
import { useAuthStore } from "@/stores/auth";

const formatLocalDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DoctorScheduleConfigPage() {
  const { user, isDoctor } = useAuthStore();
  const doctorId = user?.id; 

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localLeaves, setLocalLeaves] = useState({}); 

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "", 
    shiftData: null,
  });

  const fetchDailySchedule = async () => {
    if (!doctorId || !isDoctor || !selectedDate) return;
    
    setLoading(true);
    
    try {
      const dateString = formatLocalDate(selectedDate); 
      
      const [appRes, leaveRes] = await Promise.all([
        appointmentApi.getDoctorSchedule(doctorId),
        appointmentApi.getDoctorLeaves(doctorId) 
      ]);

      if (appRes && appRes.success) {
        const dailyApps = appRes.data.filter(app => {
          const appDateObj = new Date(app.date);
          const appDateString = formatLocalDate(appDateObj);
          return appDateString === dateString && app.status === "CONFIRMED";
        });
        setAppointments(dailyApps);
      }

      if (leaveRes && leaveRes.success) {
        const fetchedLeaves = {};
        leaveRes.data.forEach(leave => {
          const leaveDateObj = new Date(leave.date);
          const leaveDateString = formatLocalDate(leaveDateObj);
          
          if (leaveDateString === dateString) {
            if (leave.shift === null) {
              for (let i = 1; i <= 12; i++) {
                fetchedLeaves[i] = leave.id;
              }
            } else {
              fetchedLeaves[leave.shift] = leave.id;
            }
          }
        });
        setLocalLeaves(fetchedLeaves);
      }

    } catch (error) {
      console.error("Lỗi tải lịch trình:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailySchedule();
  }, [doctorId, isDoctor, selectedDate]); 

  const shiftsData = useMemo(() => {
    const shifts = [];
    const now = new Date();

    for (let i = 1; i <= 12; i++) {
      const appInShift = appointments.find(app => app.shift === i);
      const leaveId = localLeaves[i];

      let isUrgent = false;
      const shiftStartTime = new Date(selectedDate);
      shiftStartTime.setHours(6 + i, 0, 0, 0); 

      if (appInShift) {
        const diffHours = (shiftStartTime - now) / (1000 * 60 * 60);
        if (diffHours > 0 && diffHours <= 24) {
          isUrgent = true;
        }
      }

      shifts.push({
        id: i,
        name: `Ca ${i}`,
        shiftNum: i,
        status: appInShift ? "booked" : leaveId ? "off" : "empty",
        appointmentId: appInShift?.appointmentId || null,
        leaveId: leaveId || null,
        isUrgent: isUrgent,
      });
    }
    return shifts;
  }, [selectedDate, appointments, localLeaves]);

  const requestToggleShift = (shiftObj) => {
    if (shiftObj.status === "booked") {
      alert("Ca này đã có bệnh nhân đặt lịch! Vui lòng hủy lịch khám trước khi xin nghỉ.");
      return;
    }

    if (shiftObj.status === "empty") {
      setModalConfig({ isOpen: true, type: "toggle", shiftData: shiftObj });
    } else if (shiftObj.status === "off") {
      executeToggleShift(shiftObj);
    }
  };

  const executeToggleShift = async (shiftObj) => {
    try {
      if (shiftObj.status === "empty") {
        const payload = {
          date: formatLocalDate(selectedDate), // Đúng format YYYY-MM-DD
          shift: shiftObj.shiftNum,
          reason: "Bác sĩ bận việc đột xuất"
        };
        const res = await appointmentApi.registerDoctorLeave(payload);
        if (res && res.success) {
          setLocalLeaves(prev => ({ ...prev, [shiftObj.shiftNum]: res.data?.id || 'mock-id' }));
        }
      } 
      else if (shiftObj.status === "off") {
        if (shiftObj.leaveId && shiftObj.leaveId !== 'mock-id') {
          await appointmentApi.cancelDoctorLeave(shiftObj.leaveId);
        }
        setLocalLeaves(prev => {
          const newLeaves = { ...prev };
          delete newLeaves[shiftObj.shiftNum];
          return newLeaves;
        });
      }
    } catch (error) {
      console.error("Lỗi chuyển đổi ca:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái ca!");
    }
  };

  const requestCancelAppointment = (shiftObj) => {
    setModalConfig({ isOpen: true, type: "cancel", shiftData: shiftObj });
  };

  const executeCancelAppointment = async (shiftObj) => {
    try {
      await appointmentApi.updateAppointmentStatus(shiftObj.appointmentId, { status: "CANCELLED" });
      fetchDailySchedule(); 
    } catch (error) {
      console.error("Lỗi hủy lịch:", error);
      alert(error.response?.data?.message || "Lỗi khi hủy lịch khám.");
    }
  };

  const handleConfirmModal = async () => {
    const { type, shiftData } = modalConfig;
    if (!shiftData) return;

    if (type === "toggle") {
      await executeToggleShift(shiftData);
    } else if (type === "cancel") {
      await executeCancelAppointment(shiftData);
    }

    setModalConfig({ isOpen: false, type: "", shiftData: null });
  };

  if (!doctorId && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA] text-gray-500 rasa-font">
        <p className="text-lg italic">Vui lòng đăng nhập với tài khoản bác sĩ để xem và cấu hình lịch trình.</p>
      </div>
    );
  }

  if (!isDoctor && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] rasa-font">
        <p className="text-red-500 font-bold text-2xl mb-2">Truy cập bị từ chối!</p>
        <p className="text-gray-600 text-lg">Trang cấu hình ca làm việc này chỉ dành riêng cho Bác sĩ.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen flex justify-start py-10 px-4 md:px-10 lg:px-16">
      <div className="w-full max-w-[1500px] flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        <div>
          <CalendarSidebar 
            value={selectedDate} 
            onChange={(date) => {
              if(date) setSelectedDate(date);
            }} 
          />
          <p className="mt-4 text-[13px] text-gray-500 italic max-w-[320px]">
            * Mặc định hiển thị 12 ca/ngày.<br/>
            * Ca nào trống bạn có thể gạt công tắc để khóa ca (Đăng ký nghỉ).
          </p>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-end mb-2 pb-2">
            <h2 className="font-bold text-[28px] rasa-font text-black">
              Ca làm việc ngày {selectedDate.toLocaleDateString("vi-VN")}
            </h2>
          </div>
          
          <div className="w-full flex flex-col">
            {loading ? (
              <div className="text-center py-10 text-gray-500 italic">Đang tải lịch trình...</div>
            ) : (
              shiftsData.map((shift) => (
                <ShiftItem 
                  key={shift.id} 
                  data={shift} 
                  onToggle={requestToggleShift} 
                  onCancel={requestCancelAppointment} 
                />
              ))
            )}
          </div>
        </div>

      </div>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: "", shiftData: null })}
        onConfirm={handleConfirmModal}
        title="Cảnh báo"
        mainMessage={
          modalConfig.type === "cancel" 
            ? `Bạn có chắc chắn muốn hủy lịch khám bệnh của ${modalConfig.shiftData?.name?.toLowerCase() || 'bệnh nhân'}?` 
            : "Bạn có chắc chắn muốn nghỉ ca làm việc?"
        }
        subMessage="Nếu bạn xác nhận, lịch khám bệnh hiện có cũng sẽ bị hủy theo gây ảnh hưởng đến kế hoạch khám bệnh của người dùng"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
      
    </div>
  );
}