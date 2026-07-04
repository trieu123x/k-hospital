"use client"

import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { SelectBox } from "@/components/ui/SelectBox"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getMedicinesForAdmin, deleteMedicine, restoreMedicine } from "@/routers/medicine-api"
import { getAllMedicineTypes } from "@/routers/medicine-type-api"
import { useRouter } from "next/navigation"
import { Pagination } from "@/components/ui/Pagination"
import { useGlobalLoading } from "@/stores/globalLoading"

const PAGE_SIZE = 30

export default function Medicines() {
  const router = useRouter()
  const { showLoading, hideLoading } = useGlobalLoading()

  // UI State
  const [option, setOption] = useState("Tất cả loại thuốc")
  const [medicineTypes, setMedicineTypes] = useState([]) // Dữ liệu types thật
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isTrashMode, setIsTrashMode] = useState(false)

  // Data State
  const [medicines, setMedicines] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const typesRes = await getAllMedicineTypes()
        if (typesRes.data) setMedicineTypes(typesRes.data)
      } catch (error) {
        console.error("Lỗi lấy dữ liệu khởi tạo:", error)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const medicineTypesRef = useRef([])
  useEffect(() => {
    medicineTypesRef.current = medicineTypes
  }, [medicineTypes])

  const buildParams = useCallback(() => {
    const selectedType = medicineTypesRef.current.find(t => t.name === option)

    return {
      limit: PAGE_SIZE,
      page,
      typeId: selectedType?.id || undefined,
      name: debouncedSearch || undefined,
      deleted: isTrashMode
    }
  }, [option, debouncedSearch, page, isTrashMode])

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)

      try {
        const params = buildParams()
        const res = await getMedicinesForAdmin(params)

        if (res.success && res.data) {
          const mappedData = res.data.map(m => ({ ...m, medicineTypeName: m.medicineType?.name }))
          setMedicines(mappedData)
          setTotalPages(res.pagination?.totalPages || 1)
          setTotalCount(res.pagination?.totalItems || 0)
        } else if (Array.isArray(res)) {
          const mappedData = res.map(m => ({ ...m, medicineTypeName: m.medicineType?.name }))
          setMedicines(mappedData)
          setTotalPages(1)
          setTotalCount(res.length)
        } else {
          setMedicines([])
        }
      } catch (error) {
        console.error("Lỗi tải danh sách thuốc:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [buildParams])

  useEffect(() => {
    setPage(1)
  }, [option, debouncedSearch, isTrashMode])

  const handleDelete = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thuốc này không?")) return
    showLoading("Đang xóa thuốc...")
    try {
      const res = await deleteMedicine(row.id)
      if (res.success) {
        setMedicines(prev => prev.filter(d => d.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa thuốc:", error)
      alert("Xóa thất bại!")
    } finally {
      hideLoading()
    }
  }

  const handleRestore = async (row) => {
    if (!window.confirm("Bạn có chắc chắn muốn khôi phục thuốc này không?")) return
    showLoading("Đang khôi phục thuốc...")
    try {
      const res = await restoreMedicine(row.id)
      if (res.success) {
        setMedicines(prev => prev.filter(d => d.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi khôi phục thuốc:", error)
      alert("Khôi phục thất bại!")
    } finally {
      hideLoading()
    }
  }

  const columns = [
    { key: "name", label: "Tên", width: "15%" },
    { key: "medicineTypeName", label: "Loại thuốc", width: "120px" },
    { key: "ingredients", label: "Thành phần" },
    { key: "dosage", label: "Liều lượng" },
    { key: "usageInstruction", label: "Hướng dẫn sử dụng" },
    { key: "sideEffects", label: "Tác dụng phụ" },
    { 
      key: "action", 
      label: isTrashMode ? "Khôi phục" : "Xóa thuốc", 
      mode: isTrashMode ? "restore" : "del", 
      width: "120px" 
    },
  ]

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      <div className="flex h-15 px-10 items-end justify-between">
        <div className="flex items-center gap-1">
          <Filter className="w-6 h-6 flex-none" />
          <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
          <SelectBox
            placeholder="Loại thuốc"
            value={option}
            onChange={setOption}
            options={["Tất cả loại thuốc", ...medicineTypes.map(t => t.name)]}
          />
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
            <LinkButton href={"/admin/medicines/detail"} className={`
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
            placeholder="Nhập tên thuốc..."
          />
        </div>
      </div>

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden flex flex-col">
        <Table
          isLoading={loading}
          columns={columns}
          data={medicines}
          className="max-h-[calc(100vh-250px)] flex-1"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onRestore={handleRestore}
          onRowClick={isTrashMode ? undefined : (row) => router.push(`/admin/medicines/detail?id=${row.id}`)}
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