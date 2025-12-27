import axios from "axios";
import { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";
import { refreshAccessTokenAdmin } from "./adminRefreshToken";

const AxiosAdmin = axios.create({
  baseURL,
  withCredentials: true, 
});


AxiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


AxiosAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = localStorage.getItem("adminRefreshToken");
    const isRetry = originalRequest.headers["X-Custom-Retry"] === "true";

    if (status === 401 && refreshToken && !isRetry) {
      originalRequest.headers["X-Custom-Retry"] = "true";

      const newToken = await refreshAccessTokenAdmin(refreshToken);

      if (newToken) {
        localStorage.setItem("adminAccessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return AxiosAdmin(originalRequest);
      }
    }

    if (status === 401 || status === 403) {
      toast.error(
        "Phiên admin hết hạn hoặc không đủ quyền. Vui lòng đăng nhập lại."
      );
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      setTimeout(() => {
        window.location.href = "/quan-tri-vien/dang-nhap";
      }, 800);
    }

    return Promise.reject(error);
  }
);

export default AxiosAdmin;
