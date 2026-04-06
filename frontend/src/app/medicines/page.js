"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Filter, Search, ChevronRight } from "lucide-react";
import axiosInstance from "@/utils/axios";

export default function MedicineLookupPage() {
  const [medicines, setMedicines] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Medicine types based on Prisma schema
  const medicineTypes = [
    { id: "uống", name: "Thuốc uống" },
    { id: "ngậm", name: "Thuốc ngậm" },
    { id: "bôi", name: "Thuốc bôi" },
    { id: "tiêm", name: "Thuốc tiêm" },
  ];
console.log(medicines)
  // Fetch medicines based on filters
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedType) params.append("medicineType", selectedType);
        if (searchQuery) params.append("name", searchQuery);
        
        const res = await axiosInstance.get(`/medicines?${params.toString()}`);
        if (res.success) {
          // The backend returns { success: true, data: { medicines: [], pagination: {} } }
          setMedicines(res.data.medicines || []);
        }
      } catch (err) {
        console.error("Failed to fetch medicines", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedType, searchQuery]);

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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[140px]"
              >
                <option value="">Tất cả</option>
                {medicineTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Nhập tên thuốc để tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-gray-100 border-none rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content: Medicine Grid */}
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-100 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : medicines.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 xl:gap-8">
            {medicines.map((medicine) => (
              <div 
                key={medicine.id} 
                className="bg-white rounded-md border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                {/* Medicine Image */}
                <div className="relative w-full aspect-square mb-4 bg-white overflow-hidden rounded-md">
                  <Image
                    src={medicine.imageUrl || "/images/Diseases.jpg"}
                    alt={medicine.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Medicine Info */}
                <div className="w-full">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 min-h-[40px]">
                    {medicine.name}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">
                    Loại: {medicine.medicineType || "Chưa xác định"}
                  </p>
                  
                  <Link 
                    href={`/medicines/${medicine.id}`}
                    className="text-blue-600 text-[10px] font-medium hover:underline flex items-center justify-center gap-0.5"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Không tìm thấy thuốc nào phù hợp</p>
            <p className="text-sm">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc</p>
          </div>
        )}
      </div>
    </div>
  );
}
