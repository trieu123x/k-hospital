"use client"

import { CalendarSelectBox } from "@/components/ui/CalendarSelectBox"
import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getNewsForAdmin, deleteNews, getTotalNews } from "@/routers/news-api"
import { useRouter } from "next/navigation"
import { formatDate } from "@/helper/time-format"
import { format } from "date-fns"

const PAGE_SIZE = 30

const TABLE_COLUMNS = [
  { key: "title", label: "Tiêu đề", width: "30%" },
  { key: "content", label: "Nội dung" },
  { key: "release", label: "Ngày xuất bản", width: "120px" },
  { key: "action", label: "Xóa tin tức", mode: "del", width: "120px" },
]

export default function News() {
  const router = useRouter()

  // UI State
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)

  // Data State
  const [newsList, setNewsList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Refs
  const tableRef = useRef(null)
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getTotalNews()
        if (res.data) setTotalCount(res.data.total)
      } catch (error) {
        console.error("Lỗi lấy tổng số tin tức:", error)
      }
    }
    fetchCount()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const buildParams = useCallback((lastId = undefined) => {
    return {
      limit: PAGE_SIZE,
      title: debouncedSearch || undefined,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
      lastId
    }
  }, [debouncedSearch, selectedDate])

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      isFetching.current = true

      try {
        const params = buildParams()
        const res = await getNewsForAdmin(params)
        if (res.data) {
          setNewsList(res.data.map(n => ({
            ...n,
            release: formatDate(n.createdAt)
          })))
          setHasMore(res.data.length >= PAGE_SIZE)
        } else {
          setNewsList([])
        }
      } catch (error) {
        console.error("Lỗi tải danh sách tin tức:", error)
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    }

    fetchInitialData()
  }, [buildParams])

  const loadMore = useCallback(async () => {
    if (isFetching.current || !hasMore || newsList.length === 0) return

    const lastId = newsList[newsList.length - 1].id

    isFetching.current = true
    setLoading(true)

    try {
      const params = buildParams(lastId)
      const res = await getNewsForAdmin(params)

      if (res.data) {
        const mapped = res.data.map(n => ({
          ...n,
          release: formatDate(n.createdAt)
        }))
        setNewsList(prev => {
          const combined = [...prev, ...mapped]
          return Array.from(new Map(combined.map(item => [item.id, item])).values())
        })
        setHasMore(res.data.length >= PAGE_SIZE)
      }
    } catch (error) {
      console.error("Lỗi tải thêm tin tức:", error)
    } finally {
      setLoading(false)
      isFetching.current = false
    }
  }, [hasMore, newsList, buildParams])

  useEffect(() => {
    const tableEl = tableRef.current
    if (!tableEl) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = tableEl
      if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !isFetching.current) {
        loadMore()
      }
    }

    tableEl.addEventListener("scroll", handleScroll)
    return () => tableEl.removeEventListener("scroll", handleScroll)
  }, [loadMore, hasMore])

  const handleDelete = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return
    try {
      const res = await deleteNews(row.id)
      if (res.success) {
        setNewsList(prev => prev.filter(n => n.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa tin tức:", error)
      alert("Xóa thất bại!")
    }
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      <div className="flex h-15 px-10 items-end justify-between">
        <div className="flex items-center gap-1">
          <Filter className="w-6 h-6 flex-none" />
          <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
          <CalendarSelectBox
            placeholder="Ngày xuất bản"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </div>

        <div className="flex items-center gap-2">
          <LinkButton href={"/admin/news/detail"} className={`
            bg-[#070575] hover:bg-[#08069b] text-white 
            rounded-[10px] font-light 
          `}>
            Thêm
          </LinkButton>
          <SearchInput
            className="w-95 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tiêu đề..."
          />
        </div>
      </div>

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden">
        <Table
          ref={tableRef}
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={newsList}
          className="max-h-[calc(100vh-250px)]"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onRowClick={(row) => router.push(`/admin/news/detail?id=${row.id}`)}
        />

        <div className="flex pt-4">
          <span className="font-bold italic text-[#1100CD] text-[12px]">
            Tổng số {totalCount}
          </span>
        </div>
      </div>
    </div>
  )
}