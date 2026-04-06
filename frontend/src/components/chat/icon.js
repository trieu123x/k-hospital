import { twMerge } from "tailwind-merge"

export function ChatIcon({ children, id, onClick = () => { }, className = "" }) {
  return <button
    id={id}
    onClick={onClick}
    className={twMerge(`
      w-17 h-17 rounded-full cursor-pointer
      bg-[#5F97FF] border-4 border-[#B1CCFF]
      flex items-center justify-center
      ${className}
    `)}
  >
    {children}
  </button>
}