"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function DoctorsPage() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy danh sách chuyên khoa
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axiosInstance.get("/specialties");
        if (res.data?.data) {
          setSpecialties(res.data.data);
        } else if (Array.isArray(res.data)) {
          setSpecialties(res.data);
        } else {
          setSpecialties([]);
        }
      } catch (err) {
        console.error("Failed to fetch specialties", err);
      }
    };
    fetchSpecialties();
  }, []);

  // Lấy danh sách bác sĩ dựa vào filter
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        let url = "/doctors";
        const params = new URLSearchParams();
        
        if (selectedSpecialty && selectedSpecialty !== "") {
          params.append("specialtyId", selectedSpecialty);
        }
        if (searchQuery && searchQuery.trim() !== "") {
          params.append("name", searchQuery.trim());
        }
        params.append("limit", "12");
        params.append("page", page.toString());

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await axiosInstance.get(url);
        if (res.success && res.data) {
          setDoctors(res.data);
          setTotalPages(res.pagination?.totalPages || 1);
        } else if (Array.isArray(res)) {
          setDoctors(res);
          setTotalPages(1);
        } else {
          setDoctors([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchDoctors();
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [selectedSpecialty, searchQuery, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedSpecialty, searchQuery]);

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 xl:px-12 max-w-[1536px] mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 mt-2">
        {/* Bộ lọc chuyên khoa */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter className="text-gray-800 w-5 h-5 hidden md:block" />
          <span className="text-gray-800 font-medium hidden md:inline whitespace-nowrap">Bộ lọc:</span>
          <div className="relative w-full md:w-56">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer text-[13px]"
            >
              <option value="">Tất cả</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="relative w-full md:w-[600px]">
          <input
            type="text"
            className="block w-full pl-5 pr-11 py-2.5 border border-gray-100 rounded-full bg-[#f4f4f5] text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 text-[13px] transition-colors"
            placeholder="Nhập tên bác sĩ để tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-800" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="bg-white border border-gray-100/80 rounded-sm shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300"
            >
              {/* Doctor Avatar */}
              <div className="relative w-full aspect-[4/5] bg-[#f6f7f9]">
                <Image
                  src={doctor.profile?.avatarUrl || "/images/Avartar.jpg"}
                  alt={doctor.profile?.fullName || "Doctor"}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
              </div>

              {/* Doctor Info */}
              <div className="p-3.5 flex flex-col bg-white text-left h-full">
                <h3 className="font-bold  text-gray-900 text-2sm leading-snug mb-1">
                  {doctor.degree ? `${doctor.degree.name?.normalize('NFC')} - ` : ""} {doctor.profile?.fullName?.normalize('NFC')}
                </h3>
                
                <p className="text-gray-500 text-[11px] mb-4 line-clamp-2">
                  Chuyên khoa: {doctor.specialty?.name || doctor.specialty || "Đa khoa"} 
                </p>
                
                <div className="mt-auto text-center pt-2">
                  <Link 
                    href={`/doctors/${doctor.id}`} 
                    className="text-blue-500 text-[11px] hover:text-blue-700 hover:underline underline-offset-2"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 text-gray-500 flex flex-col items-center">
          <Search className="w-10 h-10 text-gray-300 mb-4" />
          <p className="text-base font-medium text-gray-600 mb-1">Không tìm thấy bác sĩ</p>
          <p className="text-sm">Hãy thử tìm với từ khóa hoặc chuyên khoa khác.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 mb-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Trước
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
