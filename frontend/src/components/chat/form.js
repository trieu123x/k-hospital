"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChatIcon } from "./icon"
import { Plus, Menu, MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useChatStore } from "@/stores/chat"
import { aiChatApi, createChatSession, getSessionHistory, saveChatMessage } from "@/routers/chat-api"
import { ChatHistory } from "./history"
import ReactMarkdown from 'react-markdown'

export function ChatForm() {
  const { isOpen, toggleChat, session, chatSessions, addChatSession, resetSession, setSession, updateLastAIMessage } = useChatStore(state => state)
  const [isHistoryOpen, setHistoryOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const textareaRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const isFetchingRef = useRef(false)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [inputText])

  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (session && isOpen) {
        try {
          if (chatSessions.length === 0) {
            const response = await getSessionHistory(session, { limit: 20 })
            const msgs = response.data.messages || []
            const formattedMsgs = msgs.map(m => ({
              id: m.id,
              role: m.role,
              message: m.content
            }))

            setSession(session, formattedMsgs)
            setHasMore(msgs.length === 20)
          }
        } catch (error) {
          console.error("Lỗi lấy lịch sử chat:", error)
        }
      }
    }
    fetchInitialMessages()
  }, [session, isOpen, chatSessions.length, setSession])

  const handleScroll = useCallback(async () => {
    const container = scrollContainerRef.current
    if (!container || !session || !hasMore || isFetchingRef.current) return

    const isNearTop = container.scrollHeight + container.scrollTop <= container.clientHeight + 50

    if (isNearTop) {
      isFetchingRef.current = true
      setIsLoadingMore(true)

      try {
        const oldestMsgId = chatSessions[chatSessions.length - 1]?.id

        if (oldestMsgId) {
          const response = await getSessionHistory(session, {
            limit: 20,
            lastId: oldestMsgId
          })

          const newMsgs = response.data.messages || []

          if (newMsgs.length > 0) {
            const formattedMsgs = newMsgs.map(m => ({
              id: m.id,
              role: m.role,
              message: m.content
            }))
            setSession(session, [...chatSessions, ...formattedMsgs])
          }

          setHasMore(newMsgs.length === 20)
        }
      } catch (error) {
        console.error("Lỗi tải thêm tin nhắn:", error)
      } finally {
        setIsLoadingMore(false)
        isFetchingRef.current = false
      }
    }
  }, [session, hasMore, chatSessions, setSession])

  const handleInput = (e) => {
    setInputText(e.target.value)
  }

  const handleSend = async () => {
    if (!inputText.trim()) return

    const questionToAsk = inputText
    setInputText("")

    setIsTyping(true)
    setIsThinking(true)

    let currentSessionId = session

    try {
      addChatSession({ id: crypto.randomUUID(), role: "USER", message: questionToAsk })

      if (!currentSessionId) {
        const newSessionData = await createChatSession({ content: questionToAsk })
        currentSessionId = newSessionData.data.session.id
        setSession(
          currentSessionId,
          [{
            id: newSessionData.data.message.id,
            role: newSessionData.data.message.role,
            message: newSessionData.data.message.content
          }]
        )
      } else {
        await saveChatMessage(currentSessionId, { role: "USER", content: questionToAsk })
      }

      let fullResponseText = ""
      let hasCreatedAIBubble = false

      await aiChatApi(
        currentSessionId,
        questionToAsk,
        (newChunk) => {
          if (!hasCreatedAIBubble) {
            setIsThinking(false)
            addChatSession({ id: crypto.randomUUID(), role: "AI", message: "" })
            hasCreatedAIBubble = true
          }
          fullResponseText += newChunk
          updateLastAIMessage(newChunk)
        },
        async () => {
          try {
            await saveChatMessage(currentSessionId, { role: "AI", content: fullResponseText })
            setIsTyping(false)

          } catch (err) {
            console.log("Lỗi lưu AI message DB:", err)
            setIsTyping(false)
          }
        },
        (error) => {
          console.log("Lỗi khi chat: ", error)
          setIsThinking(false)
          setIsTyping(false)
          if (!hasCreatedAIBubble) {
            addChatSession({ id: crypto.randomUUID(), role: "AI", message: "(Lỗi kết nối. Vui lòng thử lại)" });
          } else {
            updateLastAIMessage("\n\n(Lỗi kết nối. Vui lòng thử lại)")
          }
        }
      )

    } catch (error) {
      console.error("Lỗi mạng hoặc server không phản hồi:", error)
      setIsThinking(false)
      setIsTyping(false)
      setInputText(questionToAsk)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex flex-col-reverse gap-2 h-135 overflow-y-scroll hide-scrollbar"
          >
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
                  {isThinking && (
                    <div className="w-full flex gap-2 px-4">
                      <LogoMessage />
                      <div className="flex flex-col gap-2 animate-pulse">
                        <div className="max-w-75 bg-[#8380FF] rounded-2xl px-4 py-1 flex items-center">
                          Đang suy nghĩ <MoreHorizontal className="ml-1 w-5 h-5 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}

                  {chatSessions.map((chat) => (
                    <MessageForm
                      key={chat.id}
                      messageData={chat.message}
                      role={chat.role}
                    />
                  ))}

                  {isLoadingMore && (
                    <div className="w-full py-2 flex justify-center items-center text-white/70">
                      <MoreHorizontal className="animate-pulse" />
                    </div>
                  )}
                </>
            }
          </div>

          <div className="relative h-22 flex text-[16px]">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
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
        <ChatIcon onClick={toggleChat}>
          <Image width={46} height={46} src={"/images/Bot.svg"} alt="icon" className="mb-1" />
        </ChatIcon>

        {isOpen && <>
          <ChatIcon onClick={() => { resetSession() }}>
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
      <TextMessage message={messageData} />
      {haveObject && <ObjectMessage />}
    </div>
  </div>
}

function TextMessage({ message = "" }) {
  return <div className="max-w-75 bg-[#8380FF] rounded-2xl px-4 py-1 wrap-break-word">
    <ReactMarkdown>{message}</ReactMarkdown>
  </div>
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