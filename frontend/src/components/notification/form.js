import { useNotificationStore } from "@/stores/notification"
import { Button } from "../ui/Button"
import { Trash2 } from "lucide-react"
import Image from "next/image"

export function NotificationForm() {
  const notifications = useNotificationStore(state => state.notifications)

  return <div className="absolute top-[120%] text-white right-0 w-100 h-125 bg-[#0C0B3F] flex flex-col">
    <header className="rasa-font h-15 text-[28px] flex items-center justify-center">
      Notification
    </header>

    <div className="h-95 flex-none overflow-y-scroll flex flex-col hide-scrollbar">
      <NotificationCard />
      <NotificationCard />
      <NotificationCard isRead={true} />
      <NotificationCard />
      <NotificationCard isRead={true} />
    </div>

    <footer className="grow flex items-center justify-end border-t border-[#181672] mx-6">
      <Button
        className="bg-[#3D59BD] hover:bg-[#4361cc] text-[12px]"
        onClick={() => { }}>
        Xóa tất cả
      </Button>
    </footer>
  </div>
}

function NotificationCard({ isRead = false }) {
  return <div className={`
    relative w-full pb-1.5 rasa-font
    ${isRead ? "bg-[#100F51]" : "bg-[#14126A]"}
    hover:bg-[#191871]
    transition-all duration-300 ease-in-out
    flex flex-col
  `}>
    <div className="flex items-center justify-between text-[12px] h-7">
      <div className="ml-3 flex items-center gap-1.5">
        <div className="relative h-4.5 w-4.5 rounded-full overflow-hidden">
          <Image src={"/images/Avartar.jpg"} alt="" width={18} height={18} />
        </div>

        <h1>
          PGS. TS. Đỗ Ngọc Sơn
        </h1>

        {!isRead && <div className="bg-red-500 rounded-full size-1 mb-0.5"></div>}
      </div>

      <div className="mr-3">
        <span className="">
          22:22:22-22/12/2222
        </span>
      </div>
    </div>

    <div className={`
    w-full flex-1 text-[12px]
    flex justify-center overflow-hidden
    `}>
      <p className="mx-3 wrap-break-word">
        Yêu cầu thăm khám của bạn vào ngày dd/mm/yy tại chuyên khoa K vào ca khám N đã được chấp nhận, hãy nhớ chuẩn bị đầy đủ và đến đúng giờ để có được trải nghiệm tốt nhất nhé!
      </p>
    </div>

    <div className={`
      absolute right-0 h-full w-15 opacity-0 hover:opacity-100
      bg-linear-to-r from-black/10 to-[#120439]
      flex items-center justify-center
      transition-all duration-300 ease-in-out`
    }>
      <Button className="hover:bg-[#6C6AE0] transition-all duration-300 ease-in-out rounded-full px-1">
        <Trash2 className="size-4" />
      </Button>
    </div>
  </div>
}