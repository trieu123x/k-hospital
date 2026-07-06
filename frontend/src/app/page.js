"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import axiosInstance from "@/utils/axios";
import { newsApi } from "@/routers/news/newsRouter";
import { Newsitem } from "@/components/news/newsItem";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  const carouselRef = useRef(null);

  // Fetch doctors and news
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axiosInstance.get("/doctors?limit=10");
        if (res.success && res.data) {
          setDoctors(res.data);
        } else if (Array.isArray(res)) {
          setDoctors(res);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoadingDoctors(false);
      }
    };

    const fetchNews = async () => {
      try {
        const res = await newsApi.getNewsList({ limit: 6, page: 1 });
        if (res && res.success) {
          if (res.data && Array.isArray(res.data)) {
            setFeaturedNews(res.data);
          } else if (res.items) {
            setFeaturedNews(res.items);
          } else {
            setFeaturedNews(res.data?.items || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchDoctors();
    fetchNews();
  }, []);

  // Carousel scrolling: Card width 220px + gap 20px = 240px
  const scrollLeft = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / 240);
      const nextIndex = Math.max(0, currentIndex - 1);
      container.scrollTo({ left: nextIndex * 240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const currentScroll = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (currentScroll >= maxScroll - 5) return; // Already at the end

      const currentIndex = Math.round(currentScroll / 240);
      const nextIndex = currentIndex + 1;
      container.scrollTo({
        left: Math.min(nextIndex * 240, maxScroll),
        behavior: "smooth"
      });
    }
  };

  const mainEvent = featuredNews[0];
  const subEvents = featuredNews.slice(1, 6);

  return (
    <div className="w-full bg-white flex flex-col rasa-font transition-colors duration-200">

      {/* 1. Hero Section: Lý do để khách hàng tin tưởng MediCare? (Kept original UI) */}
      <div className="w-full min-h-[calc(100vh-3.75rem)] max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        {/* Left Column: Text content */}
        <div className="flex flex-col space-y-8 pr-4 lg:pl-5 lg:-mt-5">
          <h1 className="text-[52px] md:text-5xl lg:text-[52px] font-bold leading-none">
            <span className="text-black">Lý do để khách hàng</span>
            <br />
            <span className="text-[#7A78FF]">tin tưởng MediCare?</span>
          </h1>

          <p className="text-gray-700 text-base md:text-[20px] font-medium max-w-130">
            Quy tụ đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm cùng hệ thống trang thiết bị y tế hiện đại nhất, MediCare cam kết mang đến dịch vụ thăm khám chính xác, an toàn và tận tâm. Chúng tôi kết hợp y đức truyền thống với hạ tầng số hóa tiên tiến để bảo vệ sức khỏe của bạn một cách trọn vẹn
          </p>

          <div>
            <Link href="/appointment">
              <button className="bg-[#070575] text-white px-12 py-2 rounded-full font-medium hover:bg-[#150a8b] cursor-pointer transition-all duration-200 shadow-md">
                Đặt lịch ngay
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Staggered Cards */}
        <div className="flex flex-col relative gap-4 lg:gap-0 lg:pr-5">
          {/* Card 1 */}
          <div className="bg-[#3C50CE] rounded-[30px] text-white py-3.5 px-5.5 lg:self-start lg:-translate-y-2 hover:lg:-translate-y-4 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="text-[24px] font-bold">Đội ngũ chuyên gia đầu ngành</h3>
            <p className="text-[20px] opacity-90 leading-6 md:max-w-100 py-0.5">
              Đội ngũ bác sĩ giàu kinh nghiệm, điều trị trực tiếp với phác đồ chuẩn quốc tế
            </p>
            <div className="flex justify-end mt-2">
              <Link href="/doctors">
                <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#424cb8] transition-colors">
                  Xem ngay
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#5CA0FF] rounded-[30px] text-white py-3.5 px-5.5 lg:self-end lg:translate-y-5 hover:lg:translate-y-3 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="text-[24px] font-bold">Không ngừng tiến bộ</h3>
            <p className="text-[20px] opacity-90 leading-6 md:max-w-75 py-0.5">
              Luôn cập nhật các tin tức mới nhất về y tế
            </p>
            <div className="flex justify-end mt-2">
              <Link href="/news">
                <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#5ea5ff] transition-colors">
                  Xem ngay
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#6F82FF] rounded-[30px] text-white py-3.5 px-5.5 lg:self-start lg:-translate-x-20 lg:translate-y-4 hover:lg:translate-y-2 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <h3 className="text-[24px] font-bold">Thông tin phong phú</h3>
            <p className="text-[20px] opacity-90 leading-6 md:max-w-90 py-0.5">
              Cung cấp từ điển khổng lồ về thông tin của các loại bệnh và các loại thuốc
            </p>
            <div className="flex justify-end mt-2">
              <Link href="/medicines">
                <button className="text-[12px] cursor-pointer px-3 py-0.5 rounded-full border border-white hover:bg-white hover:text-[#6c7bfa] transition-colors">
                  Tra cứu ngay
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tin tức nổi bật Section */}
      <div className="w-full py-16 bg-gray-50  transition-colors duration-200">
        <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="text-left mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#070575]">
              Tin tức nổi bật
            </h2>
            <p className="text-gray-600 text-lg mt-2 font-medium">
              Cập nhật kiến thức y khoa bổ ích, tin tức hoạt động nổi bật của MediCare.
            </p>
          </div>

          {loadingNews ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070575]"></div>
            </div>
          ) : featuredNews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Main featured news card (Left column, spans 5/12) */}
              <div className="lg:col-span-5 flex">
                {mainEvent && (
                  <div className="flex flex-col bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow rounded-none w-full">
                    <div className="relative w-full h-[240px] md:h-[300px]">
                      <Image
                        src={mainEvent.newUrl || "/images/News.webp"}
                        alt={mainEvent.title || "Featured Event"}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.srcset = "";
                          e.currentTarget.src = "/images/News.webp";
                        }}
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between text-left">
                      <div className="flex flex-col flex-1 min-h-0">
                        <div className="text-black/60 text-xs italic mb-2 flex items-center gap-1">
                          <Clock className="size-3.5" />
                          <span>{new Date(mainEvent.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <h3 className="font-bold text-xl md:text-2xl text-black mb-3 leading-snug line-clamp-2">
                          {mainEvent.title}
                        </h3>
                        <p className="text-gray-700 text-[16px] leading-relaxed line-clamp-4 mt-1 mb-4 font-normal">
                          {mainEvent.content}
                        </p>
                      </div>
                      <div className="mt-auto pt-2">
                        <Link
                          href={`/news/${mainEvent.id}`}
                          className="text-[#3C50CE] text-sm font-semibold italic hover:text-blue-700 hover:underline inline-flex items-center gap-1 self-start"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sub-news list (Right column, spans 7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {subEvents.map((item) => (
                  <Newsitem key={item.id} data={item} />
                ))}
              </div>

            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 font-medium">
              Không có tin tức hoặc sự kiện nổi bật.
            </div>
          )}
        </div>
      </div>

      {/* 3. Đội ngũ chuyên gia Section */}
      <div className="w-full bg-white py-16">
        <div className="w-full max-w-[1536px] mx-auto px-4 md:px-8 xl:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-[#070575]">
                Đội ngũ chuyên gia
              </h2>
              <p className="text-gray-600 text-lg mt-2 max-w-2xl font-medium">
                Quy tụ những bác sĩ chuyên môn cao, giàu y đức và tận tâm bảo vệ sức khỏe của bạn.
              </p>
            </div>

            {/* Scroll Navigation */}
            <div className="flex gap-3">
              <button
                onClick={scrollLeft}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-[#7A78FF] hover:text-white transition-all shadow-sm cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 rounded-full bg-white border border-gray-200 hover:bg-[#7A78FF] hover:text-white transition-all shadow-sm cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          {/* Carousel container */}
          {loadingDoctors ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#070575]"></div>
            </div>
          ) : doctors.length > 0 ? (
            <div
              ref={carouselRef}
              className="flex overflow-x-auto gap-5 hide-scrollbar scroll-smooth snap-x snap-mandatory pb-4"
            >
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-none shadow-[0_0_4px_rgba(144,144,144,0.25)] overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 w-[220px] shrink-0 snap-start snap-always"
                >
                  {/* Doctor Avatar */}
                  <div className="relative w-full aspect-88/100 bg-[#f6f7f9]">
                    <Image
                      src={doctor.profile?.avatarUrl || "/images/Avartar.jpg"}
                      alt={doctor.profile?.fullName || "Doctor"}
                      fill
                      className="object-cover object-top"
                      sizes="220px"
                      onError={(e) => {
                        e.currentTarget.srcset = "";
                        e.currentTarget.src = "/images/Avartar.jpg";
                      }}
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="px-3 py-2 flex flex-col bg-white text-left h-full gap-1">
                    <h3 className="font-bold text-gray-900 text-[16px] leading-none line-clamp-1">
                      {doctor.degree ? `${doctor.degree.name?.normalize('NFC')} - ` : ""} {doctor.profile?.fullName?.normalize('NFC')}
                    </h3>

                    <p className="text-black text-[13px] line-clamp-2 min-h-[36px]">
                      Chuyên khoa: {doctor.specialty?.name || doctor.specialty || "Đa khoa"}
                    </p>

                    <div className="mt-auto text-center pt-2">
                      <Link
                        href={`/doctors/${doctor.id}`}
                        className="text-[#3C50CE] text-[11px] font-medium italic hover:text-blue-700 hover:underline underline-offset-2"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 font-medium">
              Không có dữ liệu bác sĩ.
            </div>
          )}
        </div>
      </div>

      {/* 4. Sẵn sàng chăm sóc sức khỏe Section */}
      <div className="w-full pb-16 px-4 md:px-8 xl:px-12 max-w-[1536px] mx-auto">
        <div className="w-full bg-[#070575] text-white py-16 px-6 md:px-12 xl:px-20 rounded-[30px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
          <div className="flex flex-col space-y-4 max-w-2xl text-left">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Sẵn sàng chăm sóc sức khỏe?
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed font-medium">
              Quy tụ đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm cùng hệ thống trang thiết bị y tế hiện đại nhất, MediCare cam kết mang đến dịch vụ thăm khám chính xác, an toàn và tận tâm. Chúng tôi kết hợp y đức truyền thống với hạ tầng số hóa tiên tiến để bảo vệ sức khỏe của bạn một cách trọn vẹn.
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/appointment">
              <button className="bg-white text-[#070575] px-10 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg text-lg cursor-pointer">
                Đặt lịch ngay
              </button>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
