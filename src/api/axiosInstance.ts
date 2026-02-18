import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Bearer 토큰 사용 중이므로 쿠키 전송 불필요 (CORS 이슈 완화)
  withCredentials: false,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* request interceptor */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* response interceptor */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 공통 에러 처리
    if (error.response?.status === 401) {
      // 필요 시 로그아웃 / 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
