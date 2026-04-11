"use client"

import { useNotificationStore } from "@/stores/notification"
import { Button } from "../ui/Button"
import { Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { clearReadNotificationsApi, deleteNotificationApi, getNotifications, markNotificationAsRead } from "@/routers/notification-api"
import { formatTime } from "@/helper/time-format"
import { useCallback, useEffect, useRef, useState } from "react"
import { supabase } from "@/utils/supabase"

export function NotificationForm({ currentUserId = "74d74b54-51c4-44cf-9fe7-0b70c2864776", isOpen = true }) {
  const { notifications, setNotifications, clearRead, addNotification } = useNotificationStore(state => state)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const scrollContainerRef = useRef(null)

  const isEmpty = !notifications || notifications.length === 0

  useEffect(() => {
    if (isEmpty && hasMore) {
      const fetchInitial = async () => {
        if (!currentUserId) return
        try {
          setIsLoading(true)
          const res = await getNotifications(currentUserId)
          const data = res.data || []

          setNotifications(data)
          setHasMore(data.length === 10)
        } catch (error) {
          console.error("Lỗi lấy thông báo:", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchInitial()
    }
  }, [currentUserId, setNotifications, isEmpty, hasMore])

  useEffect(() => {
    if (!currentUserId) return;

    const uniqueChannelName = `realtime-notifications-${currentUserId}-${Math.random()}`

    const channel = supabase
      .channel(uniqueChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUserId}`
        },
        (payload) => {
          console.log(`Sự kiện: ${payload.eventType} | Dữ liệu thô:`, payload)

          if (payload.eventType === 'INSERT') {
            const formattedNotification = {
              id: payload.new.id,
              userId: payload.new.user_id,
              appointmentId: payload.new.appointment_id,
              title: payload.new.title,
              message: payload.new.message,
              isRead: payload.new.is_read,
              createdAt: payload.new.created_at,
            };

            addNotification(formattedNotification)
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Kênh Realtime đã kết nối thành công và đang hóng tin!');
        } else if (status === 'TIMED_OUT') {
          console.log('Kết nối quá hạn.');
        } else if (status === 'CLOSED') {
          console.log('Kênh đã bị đóng.');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Lỗi kênh (Channel Error):', err);
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, addNotification])

  const handleScroll = useCallback(async () => {
    const container = scrollContainerRef.current
    if (!container || !hasMore || isFetchingMore) return

    const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50

    if (isNearBottom) {
      setIsFetchingMore(true)
      try {
        const lastId = notifications[notifications.length - 1]?.id
        if (lastId) {
          const res = await getNotifications(currentUserId, lastId)
          const newNotis = res.data || []

          if (newNotis.length > 0) {
            useNotificationStore.setState(state => ({
              notifications: [...state.notifications, ...newNotis]
            }))
          }

          setHasMore(newNotis.length === 10)
        }
      } catch (error) {
        console.error("Lỗi tải thêm thông báo:", error)
      } finally {
        setIsFetchingMore(false)
      }
    }
  }, [hasMore, isFetchingMore, notifications, currentUserId])

  const handleClearAllRead = async () => {
    try {
      clearRead()
      await clearReadNotificationsApi(currentUserId)
    } catch (error) {
      console.error("Lỗi xóa tất cả:", error)
    }
  }

  return <div className={`absolute top-[120%] text-white right-0 w-100 h-125 bg-[#0C0B3F] ${isOpen ? 'flex' : 'hidden'} flex-col`}>
    <header className="rasa-font h-15 text-[28px] flex items-center justify-center">
      Notification
    </header>

    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="h-95 flex-none overflow-y-scroll flex flex-col hide-scrollbar"
    >
      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center text-gray-400/80 italic text-[15px] rasa-font gap-2">
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Đang tải...</span>
            </>
          ) : (
            "Chưa có thông báo để xem"
          )}
        </div>
      ) : (
        <>
          {notifications.map((noti) => (
            <NotificationCard key={noti.id} data={noti} />
          ))}

          {isFetchingMore && (
            <div className="w-full py-3 flex justify-center items-center text-white/70">
              <Loader2 className="size-5 animate-spin" />
            </div>
          )}
        </>
      )}
    </div>

    <footer className="grow flex items-center justify-end border-t border-[#181672] mx-6">
      {!isEmpty && <Button
        className="bg-[#3D59BD] hover:bg-[#4361cc] text-[12px]"
        onClick={handleClearAllRead}>
        Xóa tất cả
      </Button>}
    </footer>
  </div>
}

function NotificationCard({ data }) {
  const { markAsRead, removeNotification } = useNotificationStore(state => state)
  const isRead = data.isRead

  const doctor = data.appointment?.doctor
  const senderName = doctor?.fullName || "Medicare"
  const senderAvatar = doctor?.avatarUrl || "/images/Avartar.jpg"

  const handleCardClick = async () => {
    if (isRead) return;
    try {
      markAsRead(data.id)
      await markNotificationAsRead(data.id)
    } catch (error) {
      console.error("Lỗi mark as read:", error)
    }
  }

  const handleDeleteClick = async (e) => {
    e.stopPropagation() // Chặn sự kiện truyền lên thẻ Card cha
    try {
      removeNotification(data.id)
      await deleteNotificationApi(data.id)
    } catch (error) {
      console.error("Lỗi delete noti:", error)
    }
  }

  return <div
    onClick={handleCardClick}
    className={`
    relative w-full pb-1.5 rasa-font
    ${isRead ? "bg-[#100F51]" : "bg-[#14126A]"}
    hover:bg-[#191871]
    transition-all duration-300 ease-in-out
    flex flex-col
  `}>
    <div className="flex items-center justify-between text-[12px] h-7">
      <div className="ml-3 flex items-center gap-1.5">
        <div className="relative h-4.5 w-4.5 rounded-full overflow-hidden">
          <Image src={senderAvatar} alt="" width={18} height={18} />
        </div>

        <h1>
          {senderName}
        </h1>

        {!isRead && <div className="bg-red-500 rounded-full size-1 mb-0.5"></div>}
      </div>

      <div className="mr-3">
        <span className="">
          {formatTime(data.createdAt)}
        </span>
      </div>
    </div>

    <div className={`
    w-full flex-1 text-[12px] mt-0.5
    flex flex-col justify-start overflow-hidden
    `}>
      <p className="mx-3 wrap-break-word text-[14px] font-bold">
        {data.title || "Thông báo hệ thống"}
      </p>

      <p className="mx-3 wrap-break-word">
        {data.message}
      </p>
    </div>

    <div className={`
      absolute right-0 h-full w-15 opacity-0 hover:opacity-100
      bg-linear-to-r from-black/10 to-[#120439]
      flex items-center justify-center
      transition-all duration-300 ease-in-out`
    }>
      <Button onClick={handleDeleteClick}
        className="hover:bg-[#6C6AE0] transition-all duration-300 ease-in-out rounded-full px-1">
        <Trash2 className="size-4" />
      </Button>
    </div>
  </div>
}