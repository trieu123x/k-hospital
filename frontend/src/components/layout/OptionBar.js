"use client";

import { LinkButton } from "../ui/LinkButton";
import { useAuthStore } from "@/stores/auth";
import { usePathname } from "next/navigation";

export function OptionBar() {
  const { isDoctor, isAdmin } = useAuthStore();

  let optionBody;

  if (isAdmin) {
    optionBody = <AdminOption />;
  } else if (isDoctor) {
    optionBody = <DoctorOption />;
  } else {
    optionBody = <PatientOption />;
  }

  return (
    <div
      className={`
        fixed top-[60px] bottom-0 w-[220px] bg-[#070575] 
        text-white rasa-font text-[20px]
        hidden xl:flex flex-col 
        transition-all duration-300 ease-in-out
        overflow-y-auto
      `}
    >
      {optionBody}
    </div>
  );
}

function AdminOption() {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/profile");

  if (isProfile) {
    return (
      <LinkButton href="/profile/admin/detail" className="hover:bg-[#050355] justify-start rounded-none">
        Thông tin cá nhân
      </LinkButton>
    );
  }

  return (
    <>
      <LinkButton href="/admin/users" className="hover:bg-[#050355] justify-start rounded-none">
        Quản lý tài khoản
      </LinkButton>

      <LinkButton href="/admin/medicines" className="hover:bg-[#050355] justify-start rounded-none">
        Quản lý thông tin thuốc
      </LinkButton>

      <LinkButton href="/admin/diseases" className="hover:bg-[#050355] justify-start rounded-none">
        Quản lý thông tin bệnh
      </LinkButton>

      <LinkButton href="/admin/news" className="hover:bg-[#050355] justify-start rounded-none">
        Quản lý tin tức
      </LinkButton>

      <LinkButton href="/admin/aggregate" className="hover:bg-[#050355] justify-start rounded-none">
        Tổng kết
      </LinkButton>
    </>
  );
}

function DoctorOption() {
  return (
    <>
      <LinkButton href="/profile/doctor/detail" className="hover:bg-[#050355] justify-start rounded-none">
        Thông tin cá nhân
      </LinkButton>

      <LinkButton href="/profile/doctor/medical_record" className="hover:bg-[#050355] justify-start rounded-none">
        Lịch sử khám bệnh
      </LinkButton>

      <LinkButton href="/profile/doctor/medical_record/not_done" className="hover:bg-[#050355] justify-start rounded-none">
        Yêu cầu chưa hoàn tất
      </LinkButton>

      <LinkButton href="/profile/doctor/schedules" className="hover:bg-[#050355] justify-start rounded-none">
        Lịch làm việc
      </LinkButton>

      <LinkButton href="/profile/doctor/appointment" className="hover:bg-[#050355] justify-start rounded-none">
        Xác nhận ca khám
      </LinkButton>
    </>
  );
}

function PatientOption() {
  return (
    <>
      <LinkButton href="/profile/patient/detail" className="hover:bg-[#050355] justify-start rounded-none">
        Thông tin cá nhân
      </LinkButton>

      <LinkButton href="/profile/patient/medical_record" className="hover:bg-[#050355] justify-start rounded-none">
        Lịch sử thăm khám
      </LinkButton>

      <LinkButton href="/profile/patient/medical_record/upcoming" className="hover:bg-[#050355] justify-start rounded-none">
        Lịch thăm khám sắp tới
      </LinkButton>
      <LinkButton href="/profile/patient/medical_record/pending" className="hover:bg-[#050355] justify-start rounded-none">
        Yêu cầu chờ phản hồi
      </LinkButton>
    </>
  );
}