export function AggregateForm({ children, title }) {
  return <div className={`relative w-full h-full flex flex-col rasa-font
  bg-white border border-gray-200 shadow-sm rounded-[10px]`}>
    <h3 className="font-bold text-black ml-2 mt-1">
      {title}
    </h3>

    <div className="absolute w-full h-full flex-1 flex items-center justify-center">
      {children}
    </div>

  </div>
}