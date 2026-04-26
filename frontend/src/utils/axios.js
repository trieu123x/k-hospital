import axios from 'axios';

// Định cấu hình URL gốc của API.
// Có thể tùy chỉnh qua biến môi trường .env.local trên Next.js (chỉ định NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://k-hospital-production.up.railway.app'; // URL máy chủ Railway

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // Gửi cookie đính kèm request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Với cookie authentication, trình duyệt tự động gửi cookie.
    // Nếu có fallback thì để lại, còn không thì không cần làm gì ở đây.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi toàn cục và trả về dữ liệu thuần
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp data để component tiện sử dụng (không cần lấy .data nữa)
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung khi gặp lỗi 401 (chưa đăng nhập hoặc token hết hạn)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Tuỳ chọn: Chuyển hướng người dùng về trang đăng nhập
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
