import { LinkButton } from "../ui/LinkButton"

export function OptionBar({ optionState = "profile", isDoctor = true }) {
  let optionBody

  switch (optionState) {
    case "admin":
      optionBody = <AdminOption />
      break;
    default:
      optionBody = <ProfileOption isDoctor={isDoctor} />
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
    <LinkButton href="/admin/users"
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý tài khoản
    </LinkButton>

    <LinkButton href="/admin/medicines"
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý thông tin thuốc
    </LinkButton>

    <LinkButton href="/admin/diseases"
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý thông tin bệnh
    </LinkButton>

    <LinkButton href="/admin/news"
      className="hover:bg-[#050355] justify-start rounded-none">
      Quản lý tin tức
    </LinkButton>

    <LinkButton href="/admin/aggregate"
      className="hover:bg-[#050355] justify-start rounded-none">
      Tổng kết
    </LinkButton>
  </>
}

function ProfileOption({ isDoctor = true }) {
  return <>
    <LinkButton href="/profile"
      className="hover:bg-[#050355] justify-start rounded-none">
      Thông tin cá nhân
    </LinkButton>

    <LinkButton href="/profile"
      className="hover:bg-[#050355] justify-start rounded-none">
      {isDoctor ? "Lịch sử khám bệnh" : "Lịch sử thăm khám"}
    </LinkButton>

    <LinkButton href="/profile"
      className="hover:bg-[#050355] justify-start rounded-none">
      Yêu cầu đã hoàn tất
    </LinkButton>

    {isDoctor && <LinkButton href="/profile"
      className="hover:bg-[#050355] justify-start rounded-none">
      Lịch khám bệnh
    </LinkButton>}
  </>
}