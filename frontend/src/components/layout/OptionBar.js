"use client";

import { LinkButton } from "../ui/LinkButton"
import { ROUTES } from "@/routers"
import { useAuthStore } from "@/stores/auth"

export function OptionBar({ optionState = "profile" }) {
  let optionBody

  switch (optionState) {
    case "admin":
      optionBody = <AdminOption />
      break;
    default:
      optionBody = <ProfileOption />
      break
  }

  return <div
    className=
    {`
      fixed top-15 bottom-0 w-55 bg-[#070575] 
    text-white rasa-font text-[20px]
      hidden xl:flex flex-col
      transition-all duration-300 ease-in-out
    `}
  >
    {optionBody}
  </div>
}

function AdminOption() {
  return <>
    <LinkButton href={ROUTES.ADMIN_USERS}
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý tài khoản
    </LinkButton>

    <LinkButton href={ROUTES.ADMIN_MEDICINES}
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý thông tin thuốc
    </LinkButton>

    <LinkButton href={ROUTES.ADMIN_DISEASES}
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý thông tin bệnh
    </LinkButton>

    <LinkButton href={ROUTES.ADMIN_NEWS}
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý tin tức
    </LinkButton>

    <LinkButton href={ROUTES.ADMIN_AGGREGATE}
      className="hover:bg-[#050355] justify-start rounded-none">
      Tổng kết
    </LinkButton>
  </>
}

function ProfileOption() {
  const isDoctor = useAuthStore(state => state.isDoctor);
  return <>
    <LinkButton href={ROUTES.PROFILE}
      className="hover:bg-[#050355] justify-start rounded-none">
      Thông tin cá nhân
    </LinkButton>

    <LinkButton href={ROUTES.PROFILE}
      className="hover:bg-[#050355] justify-start rounded-none">
      {isDoctor ? "Lịch sử khám bệnh" : "Lịch sử thăm khám"}
    </LinkButton>

    <LinkButton href={ROUTES.PROFILE}
      className="hover:bg-[#050355] justify-start rounded-none">
      Yêu cầu đã hoàn tất
    </LinkButton>

    {isDoctor && <LinkButton href={ROUTES.PROFILE}
      className="hover:bg-[#050355] justify-start rounded-none">
      Lịch khám bệnh
    </LinkButton>}
  </>
}