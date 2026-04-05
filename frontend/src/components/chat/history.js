import { useChatStore } from "@/stores/chat"
import { Button } from "../ui/Button"
import { Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

export function ChatHistory({ setHistoryOpen = () => { } }) {
  const session = useChatStore(state => state.session)
  const chatHistoryRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatHistoryRef.current && !chatHistoryRef.current.contains(event.target)) {
        setHistoryOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  })

  return <div
    className="fixed inset-0 flex items-center justify-center z-40 text-white rasa-font">
    <div ref={chatHistoryRef} className="w-130 h-75 rounded-[10px] bg-[#5C90EF]">
      <header className="text-[24px] font-bold flex items-center justify-center py-4 leading-none">
        Các cuộc trò chuyện
      </header>

      <div className="flex flex-col px-5 gap-1 h-55 overflow-y-scroll hide-scrollbar">
        <div className="flex flex-col">
          <span className="text-white/80 text-[12px]">Hiện tại</span>
          <SessionSelection selected={true} setHistoryOpen={setHistoryOpen} />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-white/80 text-[12px]">Trước đó</span>
          <SessionSelection setHistoryOpen={setHistoryOpen} />
          <SessionSelection setHistoryOpen={setHistoryOpen} />
          <SessionSelection setHistoryOpen={setHistoryOpen} />
          <SessionSelection setHistoryOpen={setHistoryOpen} />
        </div>
      </div>
    </div>
  </div>
}

function SessionSelection({
  id, selected = false,
  name = "Theo như những dấu hiệu bạn mô tả, tôi cho rằng",
  setHistoryOpen = () => { }
}) {

  return <Button onClick={() => {
    if (!selected) {
      setHistoryOpen(false)
    }
  }}
    className={`
    ${selected ? "bg-[#A4C4FF]" : "bg-[#5382D8] hover:bg-[#7EA4E9]"}
    rounded-[10px] py-2 justify-between
  `}>
    <p className="text-[13px] flex-1 text-start truncate">{name}</p>
    <Trash2 onClick={() => { }}
      className="size-4 opacity-60 hover:opacity-100 transition-all duration-300 ease-in-out"
    />
  </Button>
}