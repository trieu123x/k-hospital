import { Search } from "lucide-react";
import { twMerge } from "tailwind-merge"

export function SearchInput({
  placeholder = "Nhập tên người dùng để tìm kiếm",
  value,
  onChange,
  className = ""
}) {
  return (
    <div className={twMerge(`relative flex items-center w-full bg-[#ECECEC] rounded-[10px] ${className}`)}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full text-gray-800 
          pl-4 pr-10 
          placeholder:text-gray-500 placeholder:italic
          focus:outline-none transition-all
        `}
      />
      <Search className="absolute right-3 w-5 h-5 text-black stroke-[2.5px]" />
    </div>
  );
}