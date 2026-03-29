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