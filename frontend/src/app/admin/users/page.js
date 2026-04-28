"use client"

import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { SelectBox } from "@/components/ui/SelectBox"
import { Table } from "@/components/ui/Table"
import { Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { getUsersForAdmin, deleteUser, toggleBlockUser, getTotalUsers } from "@/routers/user-api"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 15

const TABLE_COLUMNS = [
  { key: "name", label: "T\u00ean", width: "25%" },
  { key: "phone", label: "S\u1ed1 \u0111i\u1ec7n tho\u1ea1i", width: "180px" },
  { key: "email", label: "Email" },
  { key: "role", label: "Vai tr\u00f2", width: "150px" },
  { key: "isBlocked", label: "Ch\u1eb7n t\u00e0i kho\u1ea3n", mode: "tick", width: "130px" },
  { key: "action", label: "X\u00f3a t\u00e0i kho\u1ea3n", mode: "del", width: "120px" },
]

export default function User() {
  const router = useRouter()

  // UI State
  const [option, setOption] = useState("T\u1ea5t c\u1ea3")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Data State
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setCurrentPage(1) // reset về trang 1 khi search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Reset page về 1 khi đổi filter
  useEffect(() => {
    setCurrentPage(1)
  }, [option])

  const mapUserData = (user) => ({
    ...user,
    name: user.fullName,
    isBlocked: !user.isActive
  })

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      // Gọi song song: lấy danh sách + tổng số
      const params = {
        page,
        limit: PAGE_SIZE,
        role: option !== "T\u1ea5t c\u1ea3" ? option : undefined,
        name: debouncedSearch || undefined,
      }

      const [usersRes, countRes] = await Promise.all([
        getUsersForAdmin(params),
        getTotalUsers()
      ])

      if (usersRes.data) {
        setUsers(usersRes.data.map(mapUserData))
      }
      // Backend trả về số nguyên trực tiếp trong res.data
      if (countRes.data !== undefined) {
        setTotalCount(countRes.data)
      }
    } catch (error) {
      console.error("L\u1ed7i t\u1ea3i d\u1eef li\u1ec7u:", error)
    } finally {
      setLoading(false)
    }
  }, [option, debouncedSearch])

  useEffect(() => {
    fetchData(currentPage)
  }, [fetchData, currentPage])

  const handleDelete = async (row, e) => {
    if (e) e.stopPropagation()
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return
    try {
      const res = await deleteUser(row.id)
      if (res.success) {
        const newTotal = totalCount - 1
        setTotalCount(newTotal)
        // Nếu xóa user cuối trên trang → lùi về trang trước
        const newTotalPages = Math.ceil(newTotal / PAGE_SIZE)
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages) // useEffect sẽ tự fetch
        } else {
          fetchData(currentPage) // Reload lại trang hiện tại
        }
      }
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error)
      alert("Xóa thất bại!")
    }
  }

  const handleTick = async (isChecked, row, e) => {
    if (e) e.stopPropagation()

    // 1. Cập nhật UI ngay lập tức (Optimistic Update)
    setUsers(prev => prev.map(u =>
      u.id === row.id ? { ...u, isBlocked: isChecked } : u
    ))

    try {
      // 2. Gọi API backend sau
      await toggleBlockUser(row.id, !isChecked)
    } catch (error) {
      // 3. Nếu API lỗi -> Rollback về trạng thái cũ
      console.error("L\u1ed7i ch\u1eb7n/m\u1edf ch\u1eb7n ng\u01b0\u1eddi d\u00f9ng:", error)
      setUsers(prev => prev.map(u =>
        u.id === row.id ? { ...u, isBlocked: !isChecked } : u
      ))
      alert("Thao t\u00e1c th\u1ea5t b\u1ea1i!")
    }
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      {/* Header: Bộ lọc + Tổng số + Nút thêm + Search */}
      <div className="flex h-15 px-10 items-end justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-6 h-6 flex-none" />
          <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
          <SelectBox
            placeholder="Vai trò"
            value={option}
            onChange={setOption}
            options={["T\u1ea5t c\u1ea3", "ADMIN", "DOCTOR", "PATIENT"]}
          />
          <span className="font-bold italic text-[#1100CD] text-[13px] ml-2">
            Tổng số: {totalCount} người dùng
          </span>
        </div>

        <div className="flex items-center gap-2">
          <LinkButton href={"/admin/users/detail"} className={`
            bg-[#070575] hover:bg-[#08069b] text-white 
            rounded-[10px] font-light 
          `}>
            Thêm
          </LinkButton>
          <SearchInput
            className="w-95 py-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên người dùng..."
          />
        </div>
      </div>

      <div className="px-10 pt-3 pb-4 flex-1 flex flex-col overflow-hidden">
        <Table
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={users}
          className="flex-1 max-h-[calc(100vh-270px)]"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onTick={handleTick}
          onRowClick={(row) => router.push(`/admin/users/detail?id=${row.id}`)}
        />

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dot-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded text-sm font-medium transition-colors
                      ${currentPage === p
                        ? 'bg-[#070575] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {p}
                  </button>
                )
              )
            }

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}