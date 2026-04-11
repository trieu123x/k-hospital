export const aggregateAndSortTopList = (rows, type) => {
  const isDoctor = type === "doctor"
  const uniqueKey = isDoctor ? "doctor_name" : "disease_name"
  const sortKey = isDoctor ? "popularity_score" : "interest_score"

  const aggregatedMap = rows.reduce((acc, row) => {
    const name = row[uniqueKey]
    if (!name) return acc

    if (!acc[name]) {
      acc[name] = { ...row }
      if (isDoctor) {
        acc[name].view_count = 0
        acc[name].booking_count = 0
        acc[name].popularity_score = 0
      } else {
        acc[name].total_views = 0
        acc[name].interest_score = 0
      }
    }

    if (isDoctor) {
      acc[name].view_count += Number(row.view_count || 0)
      acc[name].booking_count += Number(row.booking_count || 0)
      acc[name].popularity_score += Number(row.popularity_score || 0)
    } else {
      acc[name].total_views += Number(row.total_views || 0)
      acc[name].interest_score += Number(row.interest_score || 0)
    }

    return acc
  }, {})

  return Object.values(aggregatedMap)
    .sort((a, b) => b[sortKey] - a[sortKey])
    .slice(0, 10)
}