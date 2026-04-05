import { useRef, useState } from "react"
import { ChatIcon } from "./icon"
import { Plus, Menu } from "lucide-react"
import Image from "next/image"
import { useChatStore } from "@/stores/chat"
import { ChatHistory } from "./history"

export function ChatForm() {
  const [isOpen, setOpen] = useState(false)
  const [isHistoryOpen, setHistoryOpen] = useState(false)

  const textareaRef = useRef(null)
  const textInput = useRef(null)

  const session = useChatStore(state => state.session)

  const handleInput = (e) => {
    const value = e.target.value;
    textInput.current = value.trim() === "" ? null : value

    // --- LOGIC TỰ ĐỘNG NỞ CHIỀU CAO ---
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  return <div className="fixed bottom-0 right-0 z-20">
    <div className="absolute bottom-0 right-0 flex flex-row-reverse gap-2">
      {isOpen &&
        <div className={`w-115 h-177 text-white rasa-font
        bg-linear-to-b from-[#B1CCFF] to-[#D2E2FF] rounded-tl-3xl`}>
          <header className="flex items-center justify-center h-20 text-[28px] font-bold">
            <span className="w-[85%] text-center truncate">MediCare Bot</span>
          </header>

          <div className="flex flex-col-reverse gap-2 h-135 overflow-y-scroll hide-scrollbar">
            {
              !session ?
                <>
                  <div className="w-full h-full flex items-center transition-all duration-300 px-8">
                    <div className="flex flex-col rasa-font fade-in">
                      <h1 className="text-[#303EFF] font-bold text-[34px] leading-none">
                        Xin chào Hải Triều!
                      </h1>
                      <span className="text-[#5552FF] italic text-[22px]">
                        Hãy để tôi giải đáp mọi thắc mắc của bạn
                      </span>
                    </div>
                  </div>
                </> :
                <>
                  <MessageForm role="USER" />
                  <MessageForm />
                  <MessageForm />
                  <MessageForm />
                  <MessageForm />
                  <MessageForm />
                  <MessageForm />
                </>
            }
          </div>

          <div className="relative h-22 flex text-[16px]">
            <textarea
              ref={textareaRef}
              onChange={handleInput}
              rows={1}
              placeholder="Hỏi Medicare"
              className={`
              absolute bottom-[30%] left-[50%] w-[90%] -translate-x-1/2
              min-h-10 max-h-30 rounded-3xl bg-[#8380FF] px-4 py-2.5
              focus:outline-none focus:ring-0
              resize-none overflow-hidden hide-scrollbar
            `}
            />
          </div>
        </div>}

      <div className={`flex flex-col gap-1 ${!isOpen && "mb-12 mr-7"} text-white`}>
        <ChatIcon onClick={() => setOpen(!isOpen)}>
          <Image width={46} height={46} src={"/images/Bot.svg"} alt="icon" className="mb-1" />
        </ChatIcon>

        {isOpen && <>
          <ChatIcon onClick={() => { }}>
            <Plus className="size-12" />
          </ChatIcon>

          <ChatIcon onClick={() => { setHistoryOpen(true) }}>
            <Menu className="size-9" />
          </ChatIcon>
        </>}
      </div>
    </div>

    {isHistoryOpen && <ChatHistory setHistoryOpen={setHistoryOpen} />}
  </div>
}

function MessageForm({ messageData, role = "AI", haveObject = false }) {
  return <div className={`w-full flex ${role === "USER" && "flex-row-reverse"} gap-2 px-4`}>
    <LogoMessage />
    <div className="flex flex-col gap-2">
      <TextMessage />
      {haveObject && <ObjectMessage />}
    </div>
  </div>
}

function TextMessage({ message = "" }) {
  return <p className="max-w-75 bg-[#8380FF] rounded-2xl px-4 py-1 wrap-break-word">
    Tôi hiện tại trong người đang cảm thấy thường xuyên bị tức ngực, khó thở và 1 số biểu hiện khác liên quan đến thở, theo bạn tôi đang bị gì?
  </p>
}

function ObjectMessage() {
  return <div className="max-w-75 bg-[#8380FF] rounded-2xl px-4 py-1 wrap-break-word">

  </div>
}

function LogoMessage({ avatar = "/images/Avartar.jpg" }) {
  return <div className="relative w-8 h-8 rounded-full overflow-hidden">
    <Image fill src={avatar} alt="" />
  </div>
}