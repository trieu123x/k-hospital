"use client"

export function KpiCard({ value }) {
  return (
    <div className="text-[32px] text-black flex items-center justify-center h-full">
      {value}
    </div>
  )
}

export function VerticalBarChart({ data = [] }) {
  if (!data || data.length === 0) return null
  const maxValue = Math.max(...data.map(d => d.value))

  const getBarColor = (percent) => {
    if (percent >= 75) return "#3B3BC5"
    if (percent >= 50) return "#4F4FF0"
    if (percent >= 25) return "#8080F8"
    if (percent >= 10) return "#B5B5FF"
    return "#C3C3D4"
  }

  return (
    <div className="relative w-full h-full flex flex-col p-2 pt-5">
      <div className="flex-1 flex items-end justify-around gap-2 w-full h-full mt-4">
        {data.map((item, index) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          const barColor = getBarColor(heightPercent)

          return (
            <div key={index} className="flex flex-col items-center justify-end h-full flex-1 max-w-[50px] group">
              <span className="text-[13px] font-medium">{item.value}</span>
              <div
                className="w-full rounded-full transition-all duration-300 cursor-pointer hover:opacity-80"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: barColor
                }}
              ></div>
              <span className="text-[13px] font-bold mt-1">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function HorizontalBarChart({ data = [] }) {
  if (!data || data.length === 0) return null
  const maxValue = Math.max(...data.map(d => d.value))

  const getBarColor = (percent) => {
    if (percent >= 75) return "#3B3BC5"
    if (percent >= 50) return "#4F4FF0"
    if (percent >= 25) return "#8080F8"
    if (percent >= 10) return "#B5B5FF"
    return "#C3C3D4"
  }

  return (
    <div className="relative w-full h-full flex flex-col p-2 pt-10">
      <div className="flex-1 flex flex-col justify-between w-full h-full gap-1">
        {data.map((item, index) => {
          const widthPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0

          const barColor = getBarColor(widthPercent)

          return (
            <div key={index} className="flex items-center w-full flex-1 max-h-[35px]">
              <div className="flex-1 h-full flex items-center">
                <div
                  className="h-full rounded-r-full flex items-center px-3 transition-all duration-500 cursor-pointer hover:opacity-80"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: barColor,
                    minWidth: 'fit-content'
                  }}
                >
                  <span className="text-white text-[13px] font-medium">{item.value}</span>
                </div>

                <span className="text-[13px] font-bold text-black ml-2 whitespace-nowrap">
                  {item.label}
                </span>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
