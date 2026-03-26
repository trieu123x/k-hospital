// Lấy ngày hôm qua dạng 'YYYY-MM-DD' (theo timezone local)
export function getYesterday() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDate(yesterday);
}

// Format Date thành 'YYYY-MM-DD'
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Lấy timestamp hiện tại dạng readable cho log
export function getTimestamp() {
  return new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    dateStyle: 'short',
    timeStyle: 'medium',
  });
}

// Các hàm tính khoảng thời gian

export function getDailyRange() {
  const yesterday = getYesterday();
  return { startDate: yesterday, endDate: yesterday };
}

export function getWeeklyRange() {
  const now = new Date();
  // Về chủ nhật tuần trước
  const end = new Date(now);
  end.setDate(now.getDate() - now.getDay());
  // Về thứ 2 tuần trước
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

export function getMonthlyRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 0);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}
