"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Newsitem } from "@/components/news/newsItem";
import SearchImage from "../../../public/images/Search.svg";
import { newsApi } from "@/routers/news/newsRouter";
import { SearchInput } from "@/components/ui/SearchInput";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  const fetchNews = async (searchQuery = "") => {
    setLoading(true);
    setError("");
    try {
      const cleanQuery = searchQuery.trim();
      const params = cleanQuery ? { title: cleanQuery } : {};

      const result = await newsApi.getNewsList(params);

      if (result && result.success) {
        setNewsList(result.data || []);
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
      fetchNews(searchTitle);
    }, 500);


    return () => clearTimeout(delayDebounceFn);

  }, [searchTitle]);
  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] py-8 rasa-font">
      <div className="w-full mx-auto px-10">

        <div className="flex w-full justify-end mb-5 rasa-font">
          <div className="relative w-[400px]">
            <SearchInput className="absplute py-1.5 bg-[#ECECEC]"
              value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 italic">Đang tải tin tức...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            {`Không tìm thấy tin tức nào phù hợp với ${searchTitle}.`}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {newsList.map((item) => (
              <Newsitem key={item.id} data={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}