"use client"

import { useEffect, useState } from "react"

export function KpiCard({ value }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let startTimestamp = null;
    const duration = 700;
    const target = Number(value) || 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [value])

  return (
    <div className="text-[32px] text-black flex items-center justify-center h-full">
      {displayValue}
    </div>
  )
}

export function VerticalBarChart({ data = [] }) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!data || data.length === 0) return null
  const maxValue = Math.max(...data.map(d => d.value))

  const getBarColor = (percent) => {
    if (percent >= 90) return "#3B3BC5"
    if (percent >= 60) return "#4F4FF0"
    if (percent >= 30) return "#8080F8"
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
                className={`w-full rounded-full transition-all
                  duration-800 ease-out cursor-pointer hover:opacity-80`}
                style={{
                  height: animate ? `${heightPercent * 0.9}%` : '0%',
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
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!data || data.length === 0) return null
  const maxValue = Math.max(...data.map(d => d.value))

  const getBarColor = (percent) => {
    if (percent >= 90) return "#3B3BC5"
    if (percent >= 60) return "#4F4FF0"
    if (percent >= 30) return "#8080F8"
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
              <div className="w-120 h-full flex items-center">
                <div
                  className={`h-full rounded-r-full flex items-center
                    px-3 transition-all duration-800 ease-out cursor-pointer hover:opacity-80`}
                  style={{
                    width: animate ? `${widthPercent * 0.7}%` : '0%',
                    backgroundColor: barColor,
                    minWidth: animate ? 'fit-content' : '0px',
                    overflow: 'hidden'
                  }}
                >
                  <span className={`text-white text-[13px] font-medium transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
                    {item.value}
                  </span>
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
