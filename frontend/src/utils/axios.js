import axios from 'axios';

// Định cấu hình URL gốc của API.
// Có thể tùy chỉnh qua biến môi trường .env.local trên Next.js (chỉ định NEXT_PUBLIC_API_URL)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'; // Đổi port 5000 hoặc 8080 tùy vào backend của bạn

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn token vào header trước khi gửi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Chỉ chạy ở phía Client (trình duyệt)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
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
        localStorage.removeItem('token');
        // Tuỳ chọn: Chuyển hướng người dùng về trang đăng nhập
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
