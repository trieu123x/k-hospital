import { twMerge } from "tailwind-merge"

export function Button({ children, id, onClick = () => { }, className = "" }) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={twMerge(`
      px-4 py-1 rounded-full cursor-pointer rasa-font
      transition-all duration-300 ease-in-out
      flex items-center justify-center gap-2
      ${className}`)}
    >
      {children}
    </button>
  )
}

