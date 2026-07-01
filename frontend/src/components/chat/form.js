"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatIcon } from "./icon";
import { Plus, Menu, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from "@/stores/auth";
import Link from "next/link";
import { ROUTES } from "@/routers";
import { getToken } from "@/utils/axios";
import {
  aiChatApi,
  createChatSession,
  getSessionHistory,
  saveChatMessage,
  updateTopic
} from "@/routers/chat-api";
import { ChatHistory } from "./history";
import ReactMarkdown from "react-markdown";

export function ChatForm() {
  const {
    isOpen,
    toggleChat,
    session,
    chatSessions,
    addChatSession,
    resetSession,
    setSession,
    updateLastAIMessage,
    sessionTitle,
  } = useChatStore((state) => state);
  const { isLogin, user } = useAuthStore((state) => state);
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const textareaRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const isFetchingRef = useRef(false);
  const hasNewMessagesRef = useRef(false);
  const prevSessionRef = useRef(session);

  // DRAG & DROP FOR CHATBOT ICON VIA HOVER HANDLE WHEN CLOSED
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    dragStart.current = { x: e.clientX, y: e.clientY };
    offset.current = { x: position.x, y: position.y };
    setIsDragging(true);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation();
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    offset.current = { x: position.x, y: position.y };
    setIsDragging(true);
  };

  // Dragging event listeners attachment based on isDragging state
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: offset.current.x + dx,
        y: offset.current.y + dy
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    const onTouchMove = (e) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPosition({
        x: offset.current.x + dx,
        y: offset.current.y + dy
      });
    };

    const onTouchEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging]);


  useEffect(() => {
    if (prevSessionRef.current && prevSessionRef.current !== session) {
      if (hasNewMessagesRef.current) {
        updateTopic(prevSessionRef.current).catch(err => console.error("Lỗi update topic:", err));
        hasNewMessagesRef.current = false;
      }
    }
    prevSessionRef.current = session;
  }, [session]);

  useEffect(() => {
    const handleUnload = () => {
      if (session && hasNewMessagesRef.current) {
        const token = getToken() || "";
        const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
        const url = `${API_URL}/chat/${session}/topic`;
        fetch(url, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          keepalive: true
        }).catch(() => { });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [session]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText]);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (session && isOpen) {
        try {
          if (chatSessions.length === 0) {
            const response = await getSessionHistory(session, { limit: 20 });
            const msgs = response.data.messages || [];
            const title = response.data.session?.title || "MediCare Bot";
            const formattedMsgs = msgs.map((m) => ({
              id: m.id,
              role: m.role,
              message: m.content,
            }));

            setSession(session, formattedMsgs, title);
            setHasMore(msgs.length === 20);
          }
        } catch (error) {
          console.error("Lỗi lấy lịch sử chat:", error);
        }
      }
    };
    fetchInitialMessages();
  }, [session, isOpen, chatSessions.length, setSession]);

  const handleScroll = useCallback(async () => {
    const container = scrollContainerRef.current;
    if (!container || !session || !hasMore || isFetchingRef.current) return;

    const isNearTop =
      container.scrollHeight + container.scrollTop <=
      container.clientHeight + 50;

    if (isNearTop) {
      isFetchingRef.current = true;
      setIsLoadingMore(true);

      try {
        const oldestMsgId = chatSessions[chatSessions.length - 1]?.id;

        if (oldestMsgId) {
          const response = await getSessionHistory(session, {
            limit: 20,
            lastId: oldestMsgId,
          });

          const newMsgs = response.data.messages || [];

          if (newMsgs.length > 0) {
            const formattedMsgs = newMsgs.map((m) => ({
              id: m.id,
              role: m.role,
              message: m.content,
            }));
            setSession(session, [...chatSessions, ...formattedMsgs]);
          }

          setHasMore(newMsgs.length === 20);
        }
      } catch (error) {
        console.error("Lỗi tải thêm tin nhắn:", error);
      } finally {
        setIsLoadingMore(false);
        isFetchingRef.current = false;
      }
    }
  }, [session, hasMore, chatSessions, setSession]);

  const handleInput = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const questionToAsk = inputText;
    setInputText("");

    setIsTyping(true);
    setIsThinking(true);

    let currentSessionId = session;

    try {
      addChatSession({
        id: crypto.randomUUID(),
        role: "USER",
        message: questionToAsk,
      });

      if (!currentSessionId) {
        const newSessionData = await createChatSession({
          content: questionToAsk,
        });
        currentSessionId = newSessionData.data.session.id;
        const title = newSessionData.data.session?.title || "New Chat";
        setSession(currentSessionId, [
          {
            id: newSessionData.data.message.id,
            role: newSessionData.data.message.role,
            message: newSessionData.data.message.content,
          },
        ], title);
      } else {
        await saveChatMessage(currentSessionId, {
          role: "USER",
          content: questionToAsk,
        });
      }

      hasNewMessagesRef.current = true;

      let fullResponseText = "";
      let hasCreatedAIBubble = false;

      await aiChatApi(
        currentSessionId,
        questionToAsk,
        (newChunk) => {
          if (!hasCreatedAIBubble) {
            setIsThinking(false);
            addChatSession({
              id: crypto.randomUUID(),
              role: "AI",
              message: "",
            });
            hasCreatedAIBubble = true;
          }
          fullResponseText += newChunk;
          updateLastAIMessage(newChunk);
        },
        async () => {
          setIsTyping(false);
        },
        (error) => {
          console.log("Lỗi khi chat: ", error);
          setIsThinking(false);
          setIsTyping(false);
          if (!hasCreatedAIBubble) {
            addChatSession({
              id: crypto.randomUUID(),
              role: "AI",
              message: "(Lỗi kết nối. Vui lòng thử lại)",
            });
          } else {
            updateLastAIMessage("\n\n(Lỗi kết nối. Vui lòng thử lại)");
          }
        },
      );
    } catch (error) {
      console.error("Lỗi mạng hoặc server không phản hồi:", error);
      setIsThinking(false);
      setIsTyping(false);
      setInputText(questionToAsk);
      addChatSession({
        id: crypto.randomUUID(),
        role: "AI",
        message: "Lỗi kết nối hoặc máy chủ không phản hồi. Vui lòng thử lại sau.",
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-20">
      <div className="absolute bottom-0 right-0 flex flex-row-reverse gap-2">
        {isOpen && (
          <div
            className={`w-115 h-177 text-white rasa-font
        bg-linear-to-b from-[#B1CCFF] to-[#D2E2FF] rounded-tl-3xl`}
          >
            <header className="flex items-center justify-center h-20 text-[28px] font-bold">
              <span className="w-[85%] text-center truncate">{sessionTitle}</span>
            </header>

            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-col-reverse gap-2 h-135 overflow-y-scroll hide-scrollbar"
            >
              {!isLogin ? (
                <div className="w-full h-full flex items-center justify-center transition-all duration-300 px-8 text-center">
                  <div className="flex flex-col gap-4 items-center fade-in">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-2">
                      <ChatIcon className="text-white scale-150" />
                    </div>
                    <h2 className="text-white font-bold text-[24px] leading-tight">
                      Bạn cần đăng nhập để sử dụng trợ lý y tế
                    </h2>
                    <Link
                      href={ROUTES.LOGIN}
                      className="bg-[#303EFF] text-white px-8 py-2 rounded-full font-bold hover:bg-[#1e27cc] transition-all"
                    >
                      Đăng nhập ngay
                    </Link>
                  </div>
                </div>
              ) : (!session && chatSessions.length === 0) ? (
                <>
                  <div className="w-full h-full flex items-center transition-all duration-300 px-8">
                    <div className="flex flex-col rasa-font fade-in">
                      <h1 className="text-[#303EFF] font-bold text-[34px] leading-none">
                        Xin chào {user?.fullName || 'Hải Triều'}!
                      </h1>
                      <span className="text-[#5552FF] italic text-[22px]">
                        Hãy để tôi giải đáp mọi thắc mắc của bạn
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {isThinking && (
                    <div className="w-full flex gap-2 px-4">
                      <LogoMessage />
                      <div className="flex flex-col gap-2 animate-pulse">
                        <div className="max-w-75 bg-[#8380FF] rounded-2xl px-4 py-1 flex items-center">
                          Đang suy nghĩ{" "}
                          <MoreHorizontal className="ml-1 w-5 h-5 animate-bounce" />
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
              )}
            </div>

            <div className="relative h-22 flex text-[16px]">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={!isLogin}
                placeholder={isLogin ? "Hỏi Medicare" : "Đăng nhập để đặt câu hỏi"}
                className={`
              absolute bottom-[30%] left-[50%] w-[90%] -translate-x-1/2
              min-h-10 max-h-30 rounded-3xl bg-[#8380FF] px-4 py-2.5
              focus:outline-none focus:ring-0
              resize-none overflow-hidden hide-scrollbar
              ${!isLogin && 'opacity-50 cursor-not-allowed'}
            `}
              />
            </div>
          </div>
        )}

        <div
          style={isOpen ? {} : {
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: 'none',
          }}
          className={`flex flex-col gap-1 ${!isOpen && "mb-12 mr-7"} text-white relative group select-none`}
        >
          <ChatIcon onClick={toggleChat}>
            <Image
              width={46}
              height={46}
              src={"/images/Bot.svg"}
              alt="icon"
              className="mb-1"
            />
          </ChatIcon>

          {!isOpen && (
            <div
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className={`w-6 h-6 bg-white border border-blue-200 rounded-full flex items-center justify-center absolute -top-1.5 -left-1.5 cursor-grab active:cursor-grabbing text-gray-500 hover:bg-gray-100 shadow-md z-30 transition-opacity duration-200 opacity-0 group-hover:opacity-100 ${isDragging ? 'opacity-100' : ''}`}
            >
              <svg className="w-3.5 h-3.5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="5" r="1.5"></circle>
                <circle cx="9" cy="12" r="1.5"></circle>
                <circle cx="9" cy="19" r="1.5"></circle>
                <circle cx="15" cy="5" r="1.5"></circle>
                <circle cx="15" cy="12" r="1.5"></circle>
                <circle cx="15" cy="19" r="1.5"></circle>
              </svg>
            </div>
          )}

          {isOpen && isLogin && (
            <>
              <ChatIcon
                onClick={() => {
                  resetSession();
                }}
              >
                <Plus className="size-12" />
              </ChatIcon>

              <ChatIcon
                onClick={() => {
                  setHistoryOpen(true);
                }}
              >
                <Menu className="size-9" />
              </ChatIcon>
            </>
          )}
        </div>
      </div>

      {isHistoryOpen && <ChatHistory setHistoryOpen={setHistoryOpen} />}
    </div>
  );
}

function MessageForm({ messageData, role = "AI", haveObject = false }) {
  // Parsing the messageData to extract DOCTOR_CARDs
  const doctorCardRegex = /\[DOCTOR_CARD\s+id="([^"]+)"\s+name="([^"]+)"\s+specialty="([^"]+)"\s+avatar="([^"]+)"\]/g;

  let match;
  let cards = [];
  let cleanMessage = messageData;

  if (role === "AI") {
    while ((match = doctorCardRegex.exec(messageData)) !== null) {
      cards.push({
        id: match[1],
        name: match[2],
        specialty: match[3],
        avatar: match[4]
      });
    }
    // Remove the cards from the text message to display
    cleanMessage = messageData.replace(/\[DOCTOR_CARD\s+id="[^"]+"\s+name="[^"]+"\s+specialty="[^"]+"\s+avatar="[^"]+"\]/g, "");
  }

  return (
    <div
      className={`w-full flex ${role === "USER" && "flex-row-reverse"} gap-2 px-4`}
    >
      <LogoMessage />
      <div className={`flex flex-col gap-2 max-w-75 ${role === "USER" ? "items-end" : "items-start"}`}>
        {cleanMessage.trim() && <TextMessage message={cleanMessage} />}
        {cards.map((card, idx) => (
          <ObjectMessage key={idx} data={card} />
        ))}
      </div>
    </div>
  );
}

function TextMessage({ message = "" }) {
  return (
    <div className="bg-[#8380FF] rounded-2xl px-4 py-2 wrap-break-word text-white w-fit max-w-full">
      <div className="prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 text-white">
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}

function ObjectMessage({ data }) {
  if (!data) return null;
  const { id, name, specialty, avatar } = data;
  const fallbackAvatar = "/images/Avartar.jpg";
  const avatarSrc = avatar && avatar !== "None" ? avatar : fallbackAvatar;

  return (
    <Link href={`/doctors/${id}`} className="bg-white hover:bg-gray-50 transition-colors rounded-2xl p-3 flex gap-3 items-center w-full">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-200 bg-gray-100">
        <Image fill src={avatarSrc} alt={name} className="object-cover" />
      </div>
      <div className="flex flex-col text-black flex-1 min-w-0">
        <span className="font-bold text-[15px] leading-none text-gray-800 truncate">{name}</span>
        <span className="text-[13px] text-gray-500 line-clamp-1 mt-0.5">{specialty}</span>
        <span className="text-[12px] font-medium text-[#303EFF] mt-1 flex items-center">
          Xem chi tiết <span className="ml-1 text-[16px] leading-none">&rarr;</span>
        </span>
      </div>
    </Link>
  );
}

function LogoMessage({ avatar = "/images/Avartar.jpg" }) {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden">
      <Image fill src={avatar} alt="" />
    </div>
  );
}
