import { Newsitem } from "@/components/news/newsItem"
import SearchImage from "../../../public/images/Search.svg"
import Image from "next/image";

export default function NewsPage() {
  const fakeNews = [1, 2, 3, 4, 5, 6, 7, 8, 9]; 

  return (
    <div className="w-full min-h-screen bg-[#FBFBFB] py-10">
      <div className="w-full mx-auto px-10">
        
        <div className="flex justify-end mb-5 rasa-font">
            
            <div className="relative w-[400px]">
                
                <input 
                    type="text" 
                    placeholder="Nhập tiêu đề tin tức để tìm kiếm" 
                    className="w-full px-4 py-2 pr-10 rounded-full bg-[#EAEAEA] text-[14px] italic text-gray-600 rasa-font outline-none placeholder:text-gray-500"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Image 
                        src={SearchImage}
                        alt="search"
                        width={20}
                        height={20}
                    />
                </div>

            </div>
            
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {fakeNews.map((item, index) => (
             <Newsitem key={index} />
          ))}
        </div>

      </div>
    </div>
  )
}