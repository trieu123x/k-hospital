"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, ChevronRight } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function DiseaseLookupPage() {
  const [diseases, setDiseases] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch filters data
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specRes, catRes] = await Promise.all([
          axiosInstance.get("/specialties"),
          axiosInstance.get("/disease-catgorize/all"),
        ]);
        
        console.log("Specialties result:", specRes);
        console.log("Categories result:", catRes);

        if (specRes.success && specRes.data) {
          setSpecialties(Array.isArray(specRes.data) ? specRes.data : []);
        } else if (Array.isArray(specRes)) {
          setSpecialties(specRes);
        }

        if (catRes.success && catRes.data) {
          setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        } else if (Array.isArray(catRes)) {
          setCategories(catRes);
        }
      } catch (err) {
        console.error("Failed to fetch filters", err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch diseases based on filters
  useEffect(() => {
    const fetchDiseases = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedSpecialty) params.append("specialtyId", selectedSpecialty);
        if (selectedCategory) params.append("categoryId", selectedCategory);
        if (searchQuery) params.append("name", searchQuery);
        params.append("page", page.toString());
        
        const res = await axiosInstance.get(`/disease?${params.toString()}`);
        if (res.success) {
          if (res.data.items) {
            setDiseases(res.data.items);
            setTotalPages(res.data.pagination?.totalPages || 1);
          } else {
            setDiseases(res.data);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error("Failed to fetch diseases", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchDiseases, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedSpecialty, selectedCategory, searchQuery, page]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedSpecialty, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-15 z-10">
        <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Bộ lọc:</span>
            </div>
            
            <div className="flex gap-2 flex-1 md:flex-none">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
              >
                <option value="">Chuyên khoa</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
              >
                <option value="">Nhóm bệnh</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Nhập tên bệnh để tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content: Disease Grid */}
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : diseases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {diseases.map((disease) => (
              <div 
                key={disease.id} 
                className="bg-white rounded-md border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-44"
              >
                {/* Disease Image */}
                <div className="relative w-1/3 min-w-[120px] h-full bg-gray-50">
                  <Image
                    src={disease.imageUrl || "/images/Diseases.jpg"}
                    alt={disease.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Disease Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {disease.name}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                      {disease.description || "Thông tin về bệnh đang được cập nhật. Vui lòng quay lại sau."}
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link 
                      href={`/diseases/${disease.id}`}
                      className="text-blue-600 text-xs font-medium hover:underline flex items-center gap-0.5"
                    >
                      Xem chi tiết
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Không tìm thấy bệnh nào phù hợp</p>
            <p className="text-sm">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2">
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
    </div>
  );
}
