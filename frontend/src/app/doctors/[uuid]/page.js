"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Phone, Award, GraduationCap, Briefcase, ChevronLeft, Calendar } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function DoctorDetailPage() {
  const params = useParams();
  const uuid = params.uuid;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/doctors/${uuid}`);
        if (res.success) {
          setDoctor(res.data);
        } else {
          setError("Không tìm thấy thông tin bác sĩ");
        }
      } catch (err) {
        console.error("Failed to fetch doctor detail", err);
        setError("Đã xảy ra lỗi khi tải thông tin bác sĩ");
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchDoctor();
    }
  }, [uuid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error || "Không tìm thấy bác sĩ"}</h2>
        <Link href="/doctors" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Quay lại danh sách bác sĩ
        </Link>
      </div>
    );
  }

  const { profile, specialty, degree, experience, education, achievements } = doctor;

  return (
    <div className="min-h-screen bg-white pb-12">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb / Back Link */}
        <Link href="/doctors" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Danh sách bác sĩ
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Profile Card */}
          <div className="lg:w-1/3 xl:w-1/4">
            <div className="sticky top-24">
              <div className="relative w-2/3 aspect-[4/5] rounded-sm overflow-hidden shadow-2xl mb-6 bg-gray-100">
                <Image
                  src={profile?.avatarUrl || "/images/Avartar.jpg"}
                  alt={profile?.fullName || "Doctor"}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Thông tin liên hệ</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Chuyên khoa</p>
                        <p className="text-sm font-medium text-gray-900">{specialty?.name || "Đa khoa"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bằng cấp</p>
                        <p className="text-sm font-medium text-gray-900">{degree || "Bác sĩ"}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-medium text-gray-900">{profile?.phone || "0123456789"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#0a008c] hover:bg-blue-900 text-white font-bold py-4 px-6 rounded-full shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Đặt lịch khám ngay!
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="lg:w-2/3 xl:w-3/4">
            <header className="mb-10">
              <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {degree ? `${degree} - ` : ""} {profile?.fullName}
              </h1>
              <div className="mt-4 h-1.5 w-24 bg-blue-600 rounded-full"></div>
            </header>

            <div className="space-y-12">
              {/* Experience Section */}
              <section className="relative">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Briefcase className="w-6 h-6 text-blue-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Kinh nghiệm làm việc:</h2>
                </div>
                <div className="pl-1 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {experience || "Thông tin kinh nghiệm đang được cập nhật."}
                </div>
              </section>

              {/* Education Section */}
              <section className="relative">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <GraduationCap className="w-6 h-6 text-blue-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Trình độ học vấn:</h2>
                </div>
                <div className="pl-1 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {education || "Thông tin học vấn đang được cập nhật."}
                </div>
              </section>

              {/* Achievements Section */}
              <section className="relative">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <Award className="w-6 h-6 text-blue-700" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Thành tựu:</h2>
                </div>
                <div className="pl-1 text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {achievements || "Thông tin thành tựu đang được cập nhật."}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
