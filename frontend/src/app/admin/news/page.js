"use client"

import { CalendarSelectBox } from "@/components/ui/CalendarSelectBox"
import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getNewsForAdmin, deleteNews } from "@/routers/news-api"
import { useRouter } from "next/navigation"
import { formatDate } from "@/helper/time-format"
import { format } from "date-fns"
import { Pagination } from "@/components/ui/Pagination"
import { useGlobalLoading } from "@/stores/globalLoading"

const PAGE_SIZE = 30

const TABLE_COLUMNS = [
  { key: "title", label: "Tiêu đề", width: "30%" },
  { key: "content", label: "Nội dung" },
  { key: "release", label: "Ngày xuất bản", width: "120px" },
  { key: "action", label: "Xóa tin tức", mode: "del", width: "120px" },
]

export default function News() {
  const router = useRouter()
  const { showLoading, hideLoading } = useGlobalLoading()

  // UI State
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)

  const [newsList, setNewsList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const buildParams = useCallback(() => {
    return {
      limit: PAGE_SIZE,
      page,
      title: debouncedSearch || undefined,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
    }
  }, [debouncedSearch, selectedDate, page])

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)

      try {
        const params = buildParams()
        const res = await getNewsForAdmin(params)

        if (res.success && res.data) {
          setNewsList(res.data.map(n => ({
            ...n,
            release: formatDate(n.createdAt)
          })))
          setTotalPages(res.pagination?.totalPages || 1)
          setTotalCount(res.pagination?.totalItems || 0)
        } else if (Array.isArray(res)) {
          setNewsList(res.map(n => ({
            ...n,
            release: formatDate(n.createdAt)
          })))
          setTotalPages(1)
          setTotalCount(res.length)
        } else {
          setNewsList([])
        }
      } catch (error) {
        console.error("Lỗi tải danh sách tin tức:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [buildParams])

  useEffect(() => {
    setPage(1)
  }, [selectedDate, debouncedSearch])

  const handleDelete = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) return
    showLoading("Đang xóa tin tức...")
    try {
      const res = await deleteNews(row.id)
      if (res.success) {
        setNewsList(prev => prev.filter(n => n.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa tin tức:", error)
      alert("Xóa thất bại!")
    } finally {
      hideLoading()
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

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden flex flex-col">
        <Table
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={newsList}
          className="max-h-[calc(100vh-250px)] flex-1"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onRowClick={(row) => router.push(`/admin/news/detail?id=${row.id}`)}
        />

        <div className="relative flex items-center justify-center mt-4">
          <div className="absolute left-0">
            <span className="font-bold italic text-[#1100CD] text-[12px]">
              Tổng số {totalCount}
            </span>
          </div>

          {!loading && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}