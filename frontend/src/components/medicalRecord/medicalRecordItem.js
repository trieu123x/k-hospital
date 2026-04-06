export function MedicalRecordItem({ data }) {
  return (
    <div className="w-full border border-gray-300 bg-white p-5 flex flex-col lg:flex-row gap-6 mb-4 rasa-font text-[16px]">
      
      <div className="w-full lg:w-[40%] flex flex-col gap-1 lg:border-r border-gray-300 lg:pr-6">
        <div>Chuyên khoa: <strong>{data.department}</strong></div>
        <div>Bác sĩ: <strong>{data.doctor}</strong></div>
        <div>Ngày khám: <strong>{data.date}</strong></div>
        <div>Ca khám: <strong>{data.shift}</strong></div>
        <div>
          Địa điểm khám: <strong>{data.location}</strong>
        </div>
      </div>

      <div className="w-full lg:w-[60%] text-justify text-gray-800">
        Chẩn đoán: 
        <strong> {data.diagnosis} </strong>
      </div>

    </div>
  );
}