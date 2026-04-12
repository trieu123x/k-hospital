"use client"

import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { SelectBox } from "@/components/ui/SelectBox"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getDiseasesForAdmin, deleteDisease, getTotalDiseases } from "@/routers/disease-api"
import { getSpecialties } from "@/routers/specialty-api"
import { useRouter } from "next/navigation"
import { cleanSearchTerm } from "@/helper/string-format"

const PAGE_SIZE = 30

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "15%" },
  { key: "specialtyName", label: "Chuyên khoa", width: "150px" },
  { key: "categoryName", label: "Nhóm bệnh", width: "150px" },
  { key: "description", label: "Mô tả" },
  { key: "symptoms", label: "Triệu chứng", width: "220px" },
  { key: "homeTreatment", label: "Cách xử lý tại nhà", width: "220px" },
  { key: "action", label: "Xóa bệnh", mode: "del", width: "100px" },
]

export default function Diseases() {
  const router = useRouter()

  // UI State
  const [option, setOption] = useState("Tất cả")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Data State
  const [specialties, setSpecialties] = useState([])
  const [diseases, setDiseases] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  // Refs
  const tableRef = useRef(null)
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await getSpecialties()
        if (res.data) {
          setSpecialties([{ id: null, name: "Tất cả" }, ...res.data])
        }
      } catch (error) {
        console.error("Lỗi lấy chuyên khoa:", error)
      }
    }
    fetchSpecialties()
  }, [])

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getTotalDiseases()
        if (res.data) setTotalCount(res.data.total)
      } catch (error) {
        console.error("Lỗi lấy tổng số bệnh:", error)
      }
    }
    fetchCount()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  // Hàm tạo Params chung
  const buildParams = useCallback((lastId = undefined) => {
    const selectedSpecialty = specialties.find(s => s.name === option)

    return {
      limit: PAGE_SIZE,
      specialtyId: selectedSpecialty?.id || undefined,
      name: cleanSearchTerm(debouncedSearch) || undefined,
      lastId: lastId
    }
  }, [option, debouncedSearch, specialties])

  // Fetch dữ liệu LẦN ĐẦU hoặc KHI FILTER THAY ĐỔI
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      isFetching.current = true

      try {
        const params = buildParams()
        const res = await getDiseasesForAdmin(params)
        if (res.data) {
          setDiseases(res.data)
          setHasMore(res.data.length >= PAGE_SIZE)
        }
      } catch (error) {
        console.error("Lỗi tải danh sách bệnh:", error)
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    }

    fetchInitialData()
  }, [buildParams])

  const loadMore = useCallback(async () => {
    if (isFetching.current || !hasMore || diseases.length === 0) return

    const lastId = diseases[diseases.length - 1].id

    isFetching.current = true
    setLoading(true)

    try {
      const params = buildParams(lastId)
      const res = await getDiseasesForAdmin(params)

      if (res.data) {
        setDiseases(prev => {
          const combined = [...prev, ...res.data]
          return Array.from(new Map(combined.map(item => [item.id, item])).values())
        })
        setHasMore(res.data.length >= PAGE_SIZE)
      }
    } catch (error) {
      console.error("Lỗi tải thêm bệnh:", error)
    } finally {
      setLoading(false)
      isFetching.current = false
    }
  }, [hasMore, diseases, buildParams])

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
    if (!window.confirm("Bạn có chắc chắn muốn xóa bệnh này không?")) return
    try {
      const res = await deleteDisease(row.id)
      if (res.success) {
        setDiseases(prev => prev.filter(d => d.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa bệnh:", error)
      alert("Xóa thất bại!")
    }
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      <div className="flex h-15 px-10 items-end justify-between">
        <div className="flex items-center gap-1">
          <Filter className="w-6 h-6 flex-none" />
          <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
          <SelectBox
            placeholder="Chuyên khoa"
            value={option}
            onChange={setOption}
            options={specialties.map(s => s.name)}
          />
        </div>

        <div className="flex items-center gap-2">
          <LinkButton href={"/admin/diseases/detail"} className={`
            bg-[#070575] hover:bg-[#08069b] text-white 
            rounded-[10px] font-light 
          `}>
            Thêm
          </LinkButton>
          <SearchInput
            className="w-95 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên bệnh..."
          />
        </div>
      </div>

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden">
        <Table
          ref={tableRef}
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={diseases}
          className="max-h-[calc(100vh-250px)]"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onRowClick={(row) => router.push(`/admin/diseases/detail?id=${row.id}`)}
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