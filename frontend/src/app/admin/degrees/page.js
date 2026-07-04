"use client"

import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { Table } from "@/components/ui/Table"
import { useState, useEffect, useCallback } from "react"
import { getDegreesForAdmin, deleteDegree, restoreDegree } from "@/routers/degree-api"
import { useRouter } from "next/navigation"
import { Pagination } from "@/components/ui/Pagination"
import { useGlobalLoading } from "@/stores/globalLoading"

const PAGE_SIZE = 30

export default function Degrees() {
  const router = useRouter()
  const { showLoading, hideLoading } = useGlobalLoading()

  // UI State
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isTrashMode, setIsTrashMode] = useState(false)

  // Data State
  const [degrees, setDegrees] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
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
      name: debouncedSearch || undefined,
      deleted: isTrashMode
    }
  }, [debouncedSearch, page, isTrashMode])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = buildParams()
        const res = await getDegreesForAdmin(params)
        
        if (res.success && res.data) {
          setDegrees(res.data)
          setTotalPages(res.pagination?.totalPages || 1)
          setTotalCount(res.pagination?.totalItems || 0)
        } else if (Array.isArray(res)) {
          setDegrees(res)
          setTotalPages(1)
          setTotalCount(res.length)
        } else {
          setDegrees([])
        }
      } catch (error) {
        console.error("Lỗi tải danh sách bằng cấp:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [buildParams])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, isTrashMode])

  const handleDelete = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bằng cấp này không?")) return
    showLoading("Đang xóa bằng cấp...")
    try {
      const res = await deleteDegree(row.id)
      if (res.success) {
        setDegrees(prev => prev.filter(d => d.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa bằng cấp:", error)
      alert("Xóa thất bại!")
    } finally {
      hideLoading()
    }
  }

  const handleRestore = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục bằng cấp này không?")) return
    showLoading("Đang khôi phục bằng cấp...")
    try {
      const res = await restoreDegree(row.id)
      if (res.success) {
        setDegrees(prev => prev.filter(d => d.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi khôi phục bằng cấp:", error)
      alert("Khôi phục thất bại!")
    } finally {
      hideLoading()
    }
  }

  const columns = [
    { key: "name", label: "Tên bằng cấp", width: "30%" },
    { key: "rankWeight", label: "Trọng số thứ bậc (Số)", width: "20%" },
    { key: "description", label: "Mô tả" },
    { 
      key: "action", 
      label: isTrashMode ? "Khôi phục" : "Xóa bằng cấp", 
      mode: isTrashMode ? "restore" : "del", 
      width: "150px" 
    },
  ]

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      <div className="flex h-15 px-10 items-end justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#070575]">
            {isTrashMode ? "Bằng cấp đã xóa tạm thời" : "Quản lý bằng cấp"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsTrashMode(!isTrashMode)}
            className={`
              px-4 py-1 rounded-[10px] font-light cursor-pointer rasa-font
              transition-all duration-300 ease-in-out
              flex items-center justify-center text-white
              ${isTrashMode ? "bg-gray-500 hover:bg-gray-600" : "bg-[#d9534f] hover:bg-[#c9302c]"}
            `}
          >
            {isTrashMode ? "Quay lại" : "Thùng rác"}
          </button>
          {!isTrashMode && (
            <LinkButton href={"/admin/degrees/detail"} className={`
              bg-[#070575] hover:bg-[#08069b] text-white 
              rounded-[10px] font-light 
            `}>
              Thêm
            </LinkButton>
          )}
          <SearchInput
            className="w-95 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên bằng cấp..."
          />
        </div>
      </div>

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden flex flex-col">
        <Table
          isLoading={loading}
          columns={columns}
          data={degrees}
          className="max-h-[calc(100vh-250px)] flex-1"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onRestore={handleRestore}
          onRowClick={isTrashMode ? undefined : (row) => router.push(`/admin/degrees/detail?id=${row.id}`)}
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
