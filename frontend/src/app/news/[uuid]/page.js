"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ClockImage from "../../../../public/images/Clock.svg";
import testImage from "../../../../public/images/Avartar.jpg";
import { newsApi } from "@/routers/news/newsRouter";

export default function NewsDetailPage() {
  const params = useParams();

  const newsId = params?.uuid
  console.log("NewID", newsId)

  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDetail = async () => {
    if (!newsId) return;

    setLoading(true);
    setError("");
    try {
      const result = await newsApi.getNewsDetail(newsId);

      if (result && result.success) {
        setNewsDetail(result.data);
      } else {
        setError(result?.message || "Lỗi khi lấy dữ liệu từ máy chủ.");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API chi tiết:", err);
      setError("Không thể tải chi tiết tin tức lúc này.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [newsId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FBFBFB] py-10 flex items-center justify-center">
        <p className="text-gray-500 italic text-[18px]">Đang tải nội dung tin tức...</p>
      </div>
    );
  }

  if (error || !newsDetail) {
    return (
      <div className="w-full min-h-screen bg-[#FBFBFB] py-10 flex items-center justify-center">
        <p className="text-red-500 text-[18px]">{error || "Không tìm thấy bài viết!"}</p>
      </div>
    );
  }

  const formattedDate = newsDetail.createdAt
    ? new Date(newsDetail.createdAt).toLocaleDateString('vi-VN')
    : "Đang cập nhật";

  return (
    <div className="w-full bg-[#FBFBFB] pt-10">
      <div className="w-full mx-auto px-6 lg:px-10">
        <h1 className="rasa-font font-bold text-[30px] leading-tight">
          {newsDetail.title}
        </h1>

        <div className="h-px w-full bg-[#B1B1B1] my-4"></div>
        <div className="flex gap-8">

          <div className="lg:col-span-7 flex flex-col">

            <div className="w-140 overflow-hidden">
              <Image
                src={newsDetail.newUrl || "/images/News.webp"}
                alt={newsDetail.title || "Chi tiết tin tức"}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.srcset = "";
                  e.currentTarget.src = "/images/News.webp";
                }}
              />
            </div>

            <div className="flex items-center gap-1 mt-2 italic text-[20px] rasa-font">
              <Image src={ClockImage} width={14} height={14} alt="clock" />
              <span className="text-black/60">{formattedDate}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rasa-font text-[22px] leading-7 text-justify flex flex-col gap-2">
              <p className="whitespace-pre-wrap">{newsDetail.content}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}