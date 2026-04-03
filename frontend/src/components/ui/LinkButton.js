import Link from "next/link"
import { twMerge } from "tailwind-merge"

export function LinkButton({ children, id, href = "/", onClick = () => { }, className = "" }) {
  return (
    <Link
      id={id}
      onClick={onClick}
      href={href} className={twMerge(`
      px-4 py-1 rounded-full cursor-pointer rasa-font
      transition-all duration-300 ease-in-out
      flex items-center justify-center
      ${className}`)}
    >
      {children}
    </Link>
  )
}
