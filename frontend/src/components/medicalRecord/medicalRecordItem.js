export function MedicalRecordItem({ data }) {
  return (
    <div className="w-full border border-gray-300 bg-white p-5 flex flex-col lg:flex-row gap-6 mb-4 rasa-font text-[16px]">
      
      <div className="w-full lg:w-[40%] flex flex-col gap-1 lg:border-r border-gray-200 lg:pr-6">
        <div>Chuyên khoa: <strong>{data.department}</strong></div>
        
        {data.doctor && <div>Bác sĩ: <strong>{data.doctor}</strong></div>}

        {data.patientName && <div>Người khám: <strong>{data.patientName}</strong></div>}
        {data.phone && data.phone !== "---" && <div>Số điện thoại: <strong>{data.phone}</strong></div>}

        <div>Ngày khám: <strong>{data.date}</strong></div>
        <div>Ca khám: <strong>{data.shift}</strong></div>
        <div>Địa điểm khám: <strong>{data.location}</strong></div>
        
        {(data.symptoms || data.diagnosisMsg) && (
          <div>Lý do khám: <strong className="text-gray-600">{data.symptoms || data.diagnosisMsg}</strong></div>
        )}
      </div>

      <div className="w-full lg:w-[60%] flex flex-col gap-3 text-gray-800">
        <div>
          <span className="font-bold text-[15px]">Chẩn đoán:</span>
          <div className="mt-1 bg-gray-50 p-2.5 rounded border border-gray-200 text-justify min-h-[40px]">
            {data.diagnosis || "Không có kết luận chẩn đoán."}
          </div>
        </div>

        <div>
          <span className="font-bold text-[15px]">Đơn thuốc:</span>
          <div className="mt-1 bg-gray-50 p-2.5 rounded border border-gray-200 text-justify min-h-[40px] whitespace-pre-line">
            {data.prescription || "Không có đơn thuốc."}
          </div>
        </div>

        <div>
          <span className="font-bold text-[15px]">Ghi chú (Dặn dò):</span>
          <div className="mt-1 bg-gray-50 p-2.5 rounded border border-gray-200 text-justify min-h-[40px]">
            {data.note || "Không có ghi chú thêm."}
          </div>
        </div>
      </div>

    </div>
  );
}