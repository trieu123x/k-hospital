import { useState } from "react";

export function DoctorAppointmentItem({ data, onCompleteAppointment }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [note, setNote] = useState("");

  let borderColor = "border-gray-300"; 
  if (data.status === "ongoing") borderColor = "border-[#7DA7FF]"; 
  if (data.status === "urgent") borderColor = "border-[#FF7F8E]"; 

  const handleConfirm = () => {
    if (!diagnosis.trim()) {
      alert("Vui lòng nhập 'Chẩn đoán' trước khi hoàn tất ca khám!");
      return;
    }

    const medicalRecordData = {
      diagnosis: diagnosis.trim(),
      prescription: prescription.trim(),
      note: note.trim()
    };

    onCompleteAppointment(data.id, medicalRecordData);
  };

  return (
    <div className={`w-full border ${borderColor} bg-white p-5 flex flex-col lg:flex-row mb-4 rasa-font text-[16px]`}>
      
      <div className="w-full lg:w-1/2 flex flex-col gap-1 lg:border-r border-gray-200 pr-6 relative">
        
        {data.status === "ongoing" && (
          <div className="absolute top-0 right-6 text-[#5A95FF] font-bold italic text-[20px]">
            Đang diễn ra!
          </div>
        )}

        <div>Chuyên khoa: <strong>{data.department}</strong></div>
        <div>Người khám: <strong>{data.patientName}</strong></div>
        <div>Số điện thoại liên hệ: <strong>{data.phone}</strong></div>
        <div>Ngày khám: <strong>{data.date}</strong></div>
        <div>Ca khám: <strong>{data.shift}</strong></div>
        <div>Lý do khám: <strong className="text-gray-600">{data.diagnosisMsg}</strong></div>

        {data.status === "ongoing" && (
          <div className="flex justify-end mt-4">
            <button 
              onClick={handleConfirm}
              className="border border-[#7DA7FF] text-[#5A95FF] text-[13px] px-6 py-1 rounded-full hover:bg-blue-50 transition-colors font-bold"
            >
              Xác nhận hoàn tất
            </button>
          </div>
        )}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col pl-6 relative mt-4 lg:mt-0">
        
        {data.status === "urgent" && (
          <div className="absolute top-0 right-0 text-red-600 font-bold italic text-[20px]">
            GẤP!
          </div>
        )}

        {data.status === "ongoing" ? (
          <div className="flex flex-col gap-3 w-full">
            <div>
              <label className="font-bold text-gray-800 text-[15px]">Chẩn đoán <span className="text-red-500">*</span>:</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mt-1 outline-none focus:border-[#7DA7FF] text-[14px]"
                rows="2"
                placeholder="Nhập kết luận chẩn đoán..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
            </div>
            
            <div>
              <label className="font-bold text-gray-800 text-[15px]">Đơn thuốc:</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2 mt-1 outline-none focus:border-[#7DA7FF] text-[14px]"
                rows="2"
                placeholder="Nhập đơn thuốc (nếu có)..."
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 text-[15px]">Ghi chú:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 mt-1 outline-none focus:border-[#7DA7FF] text-[14px]"
                placeholder="Dặn dò bệnh nhân..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="text-gray-800 h-full flex items-center justify-center">
            <span className="text-gray-400 italic">Chưa đến giờ khám, chưa thể nhập bệnh án.</span>
          </div>
        )}
        
      </div>

    </div>
  );
}