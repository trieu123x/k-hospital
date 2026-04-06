import Image from "next/image"
import testImage from "../../../public/images/Avartar.jpg"
import ClockImage from "../../../public/images/Clock.svg"

export function Newsitem() {
    return (
        <div className="flex w-full h-[150px] bg-white border border-gray-100 overflow-hidden shadow-sm"> 
            <div className="h-full w-[140px] flex-shrink-0">
                <Image 
                    src={testImage} 
                    alt="News"
                    width={140} 
                    height={120}
                    className="h-full w-full object-cover"
                />
            </div>
            
            <div className="flex flex-col ml-3 flex-1 justify-between py-2 pr-3">
                <div className="rasa-font font-bold text-[20px] leading-tight line-clamp-2 mr-1">
                    Ứng dụng công nghệ cao trong ghép giác mạc tại Trung tâm Mắt BVĐK Hồng Ngọc
                </div>
                <div className="flex justify-between items-center text-[16px] mt-2">
                    <div className="rasa-font flex items-center gap-1 text-gray-500">
                        <Image src={ClockImage} width={14} height={14} alt="clock"/>
                        <span>13-02-2026</span>
                    </div>
                    <a href="#" className="rasa-font text-[#204CFF] hover:underline underline-offset-2">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        </div>
    )
}