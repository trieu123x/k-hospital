"use client"

import { LinkButton } from "@/components/ui/LinkButton"
import { SearchInput } from "@/components/ui/SearchInput"
import { SelectBox } from "@/components/ui/SelectBox"
import { Table } from "@/components/ui/Table"
import { Filter } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getUsersForAdmin, deleteUser, toggleBlockUser, getTotalUsers } from "@/routers/user-api"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 30

const TABLE_COLUMNS = [
  { key: "name", label: "Tên", width: "25%" },
  { key: "phone", label: "Số điện thoại", width: "180px" },
  { key: "email", label: "Email" },
  { key: "role", label: "Vai trò", width: "150px" },
  { key: "isBlocked", label: "Chặn tài khoản", mode: "tick", width: "130px" },
  { key: "action", label: "Xóa tài khoản", mode: "del", width: "120px" },
]

export default function User() {
  const router = useRouter()

  // UI State
  const [option, setOption] = useState("Tất cả")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Data State
  const [users, setUsers] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  // Refs
  const tableRef = useRef(null)
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getTotalUsers()
        if (res.data) setTotalCount(res.data.total)
      } catch (error) {
        console.error("Lỗi lấy tổng số người dùng:", error)
      }
    }
    fetchCount()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const mapUserData = (user) => ({
    ...user,
    name: user.fullName,
    isBlocked: !user.isActive
  })

  const buildParams = useCallback((lastId = undefined) => {
    return {
      limit: PAGE_SIZE,
      role: option !== "Tất cả" ? option : undefined,
      name: debouncedSearch || undefined,
      lastId
    }
  }, [option, debouncedSearch])

  useEffect(() => {
    const fetchInitialData = async () => {
      isFetching.current = true

      try {
        const params = buildParams()
        const res = await getUsersForAdmin(params)
        if (res.data) {
          setUsers(res.data.map(mapUserData))
          setHasMore(res.data.length >= PAGE_SIZE)
        }
      } catch (error) {
        console.error("Lỗi tải danh sách người dùng:", error)
      } finally {
        setLoading(false)
        isFetching.current = false
      }
    }

    fetchInitialData()
  }, [buildParams])

  const loadMore = useCallback(async () => {
    if (isFetching.current || !hasMore || users.length === 0) return

    const lastId = users[users.length - 1].id

    isFetching.current = true
    setLoading(true)

    try {
      const params = buildParams(lastId)
      const res = await getUsersForAdmin(params)

      if (res.data) {
        const mapped = res.data.map(mapUserData)
        setUsers(prev => {
          const combined = [...prev, ...mapped]
          return Array.from(new Map(combined.map(item => [item.id, item])).values())
        })
        setHasMore(res.data.length >= PAGE_SIZE)
      }
    } catch (error) {
      console.error("Lỗi tải thêm người dùng:", error)
    } finally {
      setLoading(false)
      isFetching.current = false
    }
  }, [hasMore, users, buildParams])

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
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return
    try {
      const res = await deleteUser(row.id)
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== row.id))
        setTotalCount(prev => prev - 1)
      }
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error)
      alert("Xóa thất bại!")
    }
  }

  const handleTick = async (isChecked, row) => {
    try {
      const res = await toggleBlockUser(row.id, !isChecked)
      if (res.data) {
        setUsers(prev => prev.map(u =>
          u.id === row.id ? { ...u, isBlocked: isChecked } : u
        ))
      }
    } catch (error) {
      console.error("Lỗi chặn/mở chặn người dùng:", error)
      alert("Thao tác thất bại!")
    }
  }

  return (
    <div className="grow flex flex-col rasa-font bg-white h-full">
      <div className="flex h-15 px-10 items-end justify-between">
        <div className="flex items-center gap-1">
          <Filter className="w-6 h-6 flex-none" />
          <h1 className="mr-2 text-[20px] flex-none">Bộ lọc:</h1>
          <SelectBox
            placeholder="Vai trò"
            value={option}
            onChange={setOption}
            options={["Tất cả", "ADMIN", "DOCTOR", "PATIENT"]}
          />
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

      <div className="px-10 pt-3 pb-4 flex-1 overflow-hidden">
        <Table
          ref={tableRef}
          isLoading={loading}
          columns={TABLE_COLUMNS}
          data={users}
          className="max-h-[calc(100vh-250px)]"
          rowClassName="even:bg-white odd:bg-[#F1F4FF]"
          onDelete={handleDelete}
          onTick={handleTick}
          onRowClick={(row) => router.push(`/admin/users/detail?id=${row.id}`)}
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