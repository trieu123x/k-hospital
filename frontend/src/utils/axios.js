import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;

let token = '';

const saveToken = (accessToken) => {
  if (accessToken) {
    token = accessToken;
  }
};

const clearToken = () => {
  token = '';
};

const getToken = () => {
  return token;
};

export { saveToken, clearToken, getToken };

// ---------------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const activeToken = getToken();
      if (activeToken) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Lỗi 401 (Hết hạn Access Token) 
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined' &&
      originalRequest.url !== '/auth/login'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi API làm mới lại access token.
        const res = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });

        const { accessToken } = res.data;

        // Lưu access token mới
        saveToken(accessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Chạy lại các request đang xếp hàng
        processQueue(null, accessToken);

        // Chạy lại request gốc bị lỗi
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu API refresh báo lỗi chuyển sang Login
        processQueue(refreshError, null);
        clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;