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

function NavButton({ href, children }) {
  const pathname = usePathname();
  
  const checkActive = (path, linkHref) => {
    if (path === linkHref) return true;
    
    // For admin pages like /admin/users -> matches /admin/users/detail
    if (linkHref.startsWith("/admin/") && path?.startsWith(`${linkHref}/`)) {
      return true;
    }
    
    // For profile details
    if (linkHref.endsWith("/detail") && path?.startsWith(`${linkHref}/`)) {
      return true;
    }
    
    return false;
  };

  const isActive = checkActive(pathname, href);

  return (
    <LinkButton 
      href={href} 
      className={`justify-start rounded-none hover:bg-[#050355] ${isActive ? "bg-[#050355]" : ""}`}
    >
      {children}
    </LinkButton>
  );
}

function AdminOption() {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/profile");

  if (isProfile) {
    return (
      <NavButton href="/profile/admin/detail">
        Thông tin cá nhân
      </NavButton>
    );
  }

  return (
    <>
      <NavButton href="/admin/users">
        Quản lý tài khoản
      </NavButton>

      <NavButton href="/admin/medicines">
        Quản lý thông tin thuốc
      </NavButton>

      <NavButton href="/admin/diseases">
        Quản lý thông tin bệnh
      </NavButton>

      <NavButton href="/admin/specialties">
        Quản lý chuyên khoa
      </NavButton>

      <NavButton href="/admin/degrees">
        Quản lý bằng cấp
      </NavButton>

      <NavButton href="/admin/disease-categories">
        Quản lý loại bệnh
      </NavButton>

      <NavButton href="/admin/medicine-types">
        Quản lý loại thuốc
      </NavButton>

      <NavButton href="/admin/news">
        Quản lý tin tức
      </NavButton>

      <NavButton href="/admin/aggregate">
        Tổng kết
      </NavButton>
    </>
  );
}

function DoctorOption() {
  return (
    <>
      <NavButton href="/profile/doctor/detail">
        Thông tin cá nhân
      </NavButton>

      <NavButton href="/profile/doctor/medical_record">
        Lịch sử khám bệnh
      </NavButton>

      <NavButton href="/profile/doctor/medical_record/not_done">
        Yêu cầu chưa hoàn tất
      </NavButton>

      <NavButton href="/profile/doctor/schedules">
        Lịch làm việc
      </NavButton>

      <NavButton href="/profile/doctor/appointment">
        Xác nhận ca khám
      </NavButton>
    </>
  );
}

function PatientOption() {
  return (
    <>
      <NavButton href="/profile/patient/detail">
        Thông tin cá nhân
      </NavButton>

      <NavButton href="/profile/patient/medical_record">
        Lịch sử thăm khám
      </NavButton>

      <NavButton href="/profile/patient/medical_record/upcoming">
        Lịch thăm khám sắp tới
      </NavButton>

      <NavButton href="/profile/patient/medical_record/pending">
        Yêu cầu chờ phản hồi
      </NavButton>
    </>
  );
}