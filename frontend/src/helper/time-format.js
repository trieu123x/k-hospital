export const formatTime = (isoString) => {
  if (!isoString) return ""
  const d = new Date(isoString)
  const pad = (num) => num.toString().padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}-${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
