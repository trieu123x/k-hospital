import { useChatStore } from "@/stores/chat"
import { Button } from "../ui/Button"
import { Trash2, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { getChatSessions, deleteChatSession } from "@/routers/chat-api"

export function ChatHistory({ setHistoryOpen = () => { } }) {
  const [sessionsList, setSessionsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { session, setSession } = useChatStore(state => state)
  const chatHistoryRef = useRef(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const res = await getChatSessions({ limit: 40 })
        setSessionsList(res.data || res || [])
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatHistoryRef.current && !chatHistoryRef.current.contains(event.target)) {
        setHistoryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setHistoryOpen])


  const currentSessionObj = session ? sessionsList.find(s => s.id === session) : null
  const previousSessions = sessionsList.filter(s => s.id !== session)

  const handleDeleteSession = async (id) => {
    try {
      await deleteChatSession(id)
      setSessionsList(prev => prev.filter(s => s.id !== id))
      if (session === id) {
        setSession(null, [])
      }
    } catch (error) {
      console.error("Lỗi xóa session:", error)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 text-white rasa-font bg-black/20">
      <div ref={chatHistoryRef} className="w-130 h-75 rounded-[10px] bg-[#5C90EF]">
        <header className="text-[24px] font-bold flex items-center justify-center py-4 leading-none relative">
          Các cuộc trò chuyện
          {isLoading && <Loader2 className="absolute right-5 animate-spin size-5" />}
        </header>

        <div className="flex flex-col px-5 gap-4 h-55 overflow-y-scroll hide-scrollbar pb-4">
          {(session && currentSessionObj) && (
            <div className="flex flex-col gap-1">
              <span className="text-white/80 text-[12px]">Hiện tại</span>
              <SessionSelection
                id={currentSessionObj.id}
                name={currentSessionObj.title || "Trò chuyện mới"}
                selected={true}
                setHistoryOpen={setHistoryOpen}
                setSession={setSession}
                onDeleteSession={handleDeleteSession}
              />
            </div>
          )}

          {previousSessions.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-white/80 text-[12px]">Trước đó</span>
              {previousSessions.map((item) => (
                <SessionSelection
                  key={item.id}
                  id={item.id}
                  name={item.title || "Trò chuyện mới"}
                  setHistoryOpen={setHistoryOpen}
                  setSession={setSession}
                  onDeleteSession={handleDeleteSession}
                />
              ))}
            </div>
          )}

          {!isLoading && sessionsList.length === 0 && (
            <div className="text-center text-white/70 italic text-sm mt-4">
              Chưa có lịch sử trò chuyện nào.
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function SessionSelection({
  id,
  selected = false,
  name = "Theo như những dấu hiệu bạn mô tả...",
  setHistoryOpen = () => { },
  setSession = () => { },
  onDeleteSession = () => { }
}) {

  const handleSelectSession = () => {
    if (!selected) {
      setSession(id, [])
      setHistoryOpen(false)
    }
  }

  return (
    <Button
      onClick={handleSelectSession}
      className={`
      ${selected ? "bg-[#A4C4FF]" : "bg-[#5382D8] hover:bg-[#7EA4E9]"}
      rounded-[10px] py-2 justify-between group
    `}>
      <p className="text-[13px] flex-1 text-start truncate">{name}</p>

      <Trash2
        onClick={(e) => {
          e.stopPropagation()
          onDeleteSession(id)
        }}
        className="size-4 opacity-60 transition-all duration-300 ease-in-out hover:opacity-100"
      />
    </Button>
  )
}