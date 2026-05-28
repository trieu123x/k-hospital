import Image from "next/image"
import Link from "next/link"
import testImage from "../../../public/images/Avartar.jpg"
import ClockImage from "../../../public/images/Clock.svg"

export function Newsitem({ data }) {

    const formattedDate = data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString('vi-VN')
        : "Đang cập nhật";

    return (
        <div className="flex w-full h-[150px] bg-white border border-gray-100 overflow-hidden shadow-sm">
            <div className="h-full w-[140px] shrink-0">
                <Image
                    src={data?.newUrl || testImage}
                    alt={data?.title || "News"}
                    width={140}
                    height={150}
                    className="h-full w-full object-cover"
                    onError={(e) => { 
                      e.currentTarget.srcset = ""; 
                      e.currentTarget.src = "/images/News.webp"; 
                    }}
                />
            </div>

            <div className="flex flex-col ml-3 flex-1 justify-between py-2 pr-3">
                <div className="rasa-font font-bold text-[20px] leading-tight line-clamp-2 mr-1">
                    {data?.title}
                </div>
                <div className="flex justify-between items-center text-[16px] mt-2">
                    <div className="rasa-font flex items-center gap-1 text-black/60 italic">
                        <Image src={ClockImage} width={12} height={12} alt="clock" />
                        <span>{formattedDate}</span>
                    </div>

                    <Link
                        href={`/news/${data?.id}`}
                        className="rasa-font text-[12px] text-[#204CFF] italic hover:underline underline-offset-2 self-end mr-2"
                    >
                        Xem chi tiết
                    </Link>
                </div>
            </div>
        </div>
    )
}