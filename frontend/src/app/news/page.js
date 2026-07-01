"use client";

import { useState, useEffect } from "react";
import { Newsitem } from "@/components/news/newsItem";
import { newsApi } from "@/routers/news/newsRouter";
import { SearchInput } from "@/components/ui/SearchInput";
import { CalendarSelectBox } from "@/components/ui/CalendarSelectBox";
import { Filter } from "lucide-react";
import { format } from "date-fns";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchNews = async (searchQuery = "", currentPage = 1, filterStartDate = null, filterEndDate = null) => {
    setLoading(true);
    setError("");
    try {
      const cleanQuery = searchQuery.trim();
      const params = {
        page: currentPage,
        limit: 12,
      };
      if (cleanQuery) {
        params.title = cleanQuery;
      }
      if (filterStartDate) {
        params.startDate = format(filterStartDate, "yyyy-MM-dd");
      }
      if (filterEndDate) {
        params.endDate = format(filterEndDate, "yyyy-MM-dd");
      }

      const result = await newsApi.getNewsList(params);

      if (result && result.success) {
        if (result.data && Array.isArray(result.data)) {
          setNewsList(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
        } else if (result.items) {
          setNewsList(result.items);
          setTotalPages(result.pagination?.totalPages || 1);
        } else {
          setNewsList(result.data?.items || []);
          setTotalPages(result.data?.pagination?.totalPages || 1);
        }
      } else {
        setError(result?.message || "Lỗi khi lấy dữ liệu từ máy chủ.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      setError("Không thể tải danh sách tin tức lúc này.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchNews(searchTitle, page, startDate, endDate);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTitle, page, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [searchTitle, startDate, endDate]);

  return (
    <div className="min-h-screen w-full rasa-font py-6 px-4 md:px-8 xl:px-12 max-w-[1536px] mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Bộ lọc theo khoảng thời gian */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="text-black size-5 hidden md:block" />
          <span className="text-black text-[20px] hidden md:inline whitespace-nowrap">Bộ lọc:</span>
          <div className="relative w-fit">
            <CalendarSelectBox
              placeholder="Từ ngày"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              disabled={endDate ? { after: endDate } : undefined}
            />
          </div>
          <div className="relative w-fit">
            <CalendarSelectBox
              placeholder="Đến ngày"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              disabled={startDate ? { before: startDate } : undefined}
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-100 rounded-[12px]">
          <SearchInput className="py-1.5 bg-[#ECECEC]" placeholder="Nhập tiêu đề để tìm kiếm"
            value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : newsList.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {`Không tìm thấy tin tức nào phù hợp với "${searchTitle}".`}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {newsList.map((item) => (
            <Newsitem key={item.id} data={item} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-2 mb-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border cursor-pointer border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm font-medium transition-colors duration-200"
          >
            Trước
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-md border text-sm font-medium transition-colors duration-200 cursor-pointer ${page === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border cursor-pointer border-gray-200 rounded-md bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm font-medium transition-colors duration-200"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}