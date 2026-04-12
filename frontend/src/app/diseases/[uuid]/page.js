"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Stethoscope, Pill as PillIcon } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function DiseaseDetailPage() {
  const { uuid } = useParams();
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for "Show All" toggles
  const [showAllMedicines, setShowAllMedicines] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const res = await axiosInstance.get(`/disease/${uuid}`);
        if (res.success) {
          setDisease(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch disease details", err);
      } finally {
        setLoading(false);
      }
    };
    if (uuid) fetchDisease();
  }, [uuid]);
  console.log(disease)
  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 animate-pulse">
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="w-full md:w-1/4 aspect-square bg-gray-100 rounded-lg"></div>
          <div className="flex-1 space-y-6">
            <div className="h-10 bg-gray-100 w-1/3 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 w-full rounded"></div>
              <div className="h-4 bg-gray-100 w-full rounded"></div>
              <div className="h-4 bg-gray-100 w-2/3 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Stethoscope className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">Không tìm thấy thông tin bệnh</p>
      </div>
    );
  }

  const medicines = disease.medicines?.map(m => m.medicine) || [];
  const doctors = disease.specialty?.doctors || [];

  const displayedMedicines = showAllMedicines ? medicines : medicines.slice(0, 6);
  const displayedDoctors = showAllDoctors ? doctors : doctors.slice(0, 6);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        {/* Top Section: Disease Info */}
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 mb-16">
          {/* Left: Image and Meta */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-24">
              <div className="relative aspect-square bg-gray-50 border border-gray-100 rounded-lg overflow-hidden mb-6">
                <Image
                  src={disease.imageUrl || "/images/Diseases.jpg"}
                  alt={disease.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="text-gray-500">Chuyên khoa:</span>
                  <span className="text-gray-900 font-bold">{disease.specialty?.name || "Đang cập nhật"}</span>
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="text-gray-500">Nhóm bệnh:</span>
                  <span className="text-gray-900 font-bold">{disease.category?.name || "Mãn tính"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-6">
              {disease.name}
            </h1>

            <div className="space-y-10">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả bệnh:</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {disease.description || "Chưa có mô tả chi tiết cho bệnh này."}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Triệu chứng:</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {disease.symptoms || "Chưa có thông tin về triệu chứng."}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Xử lý tại nhà:</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {disease.homeTreatment || "Vui lòng liên hệ bác sĩ để được tư vấn chính xác nhất."}
                </div>
              </section>
            </div>
          </div>
        </div>

        <hr className="border-gray-100 mb-12" />

        {/* Suggested Medicines Section */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-8">
            <PillIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Thuốc điều trị gợi ý</h2>
          </div>

          {medicines.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {displayedMedicines.map((med) => (
                  <div key={med.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group">
                    <div className="relative aspect-square mb-3 bg-gray-50 rounded overflow-hidden">
                      <Image
                        src={med.imageUrl || "/images/Diseases.jpg"}
                        alt={med.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2 min-h-[32px]">{med.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-tighter">Loại: {med.medicineType || "uống"}</p>
                    <Link href={`/medicines/${med.id}`} className="text-[10px] text-blue-600 hover:underline block text-center border-t border-gray-50 pt-2">
                      Xem chi tiết
                    </Link>
                  </div>
                ))}
              </div>
              {medicines.length > 6 && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setShowAllMedicines(!showAllMedicines)}
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1 mx-auto text-sm"
                  >
                    {showAllMedicines ? "Thu gọn" : "Xem tất cả"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-sm">Chưa có gợi ý thuốc cho bệnh này.</p>
          )}
        </div>

        <hr className="border-gray-100 mb-12" />

        {/* Suggested Doctors Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <Stethoscope className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Bác sĩ điều trị gợi ý</h2>
          </div>

          {doctors.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {displayedDoctors.map((doc) => (
                  <div key={doc.id} className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all group text-center">
                    <div className="relative aspect-square mb-3 bg-blue-50 rounded-lg overflow-hidden mx-auto w-full">
                      <Image
                        src={doc.profile?.avatarUrl || "/images/doctor-placeholder.jpg"}
                        alt={doc.profile?.fullName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-2 min-h-[32px]">{doc.degree} - {doc.profile?.fullName}</h3>
                    <p className="text-[10px] text-gray-500 mb-3 uppercase tracking-tighter leading-tight min-h-[24px]">
                      Chuyên khoa: {disease.specialty?.name || "Đang cập nhật"}
                    </p>
                    <Link href={`/doctors/${doc.id}`} className="text-[10px] text-blue-600 hover:underline block border-t border-gray-50 pt-2">
                      Xem chi tiết
                    </Link>
                  </div>
                ))}
              </div>
              {doctors.length > 6 && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={() => setShowAllDoctors(!showAllDoctors)}
                    className="text-blue-600 font-medium hover:underline flex items-center gap-1 mx-auto text-sm"
                  >
                    {showAllDoctors ? "Thu gọn" : "Xem tất cả"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-400 text-sm">Chưa có gợi ý bác sĩ cho chuyên khoa này.</p>
          )}
        </div>
      </div>

    
    </div>
  );
}
