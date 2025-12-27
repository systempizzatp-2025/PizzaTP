import axios from "axios";
import { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";
import { refreshAccessTokenDelivery } from "./deliveryRefreshToken";

const AxiosDelivery = axios.create({
  baseURL,
  withCredentials: true,
});

AxiosDelivery.interceptors.request.use((config) => {
  const token = localStorage.getItem("deliveryAccessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

AxiosDelivery.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = localStorage.getItem("deliveryRefreshToken");
    const isRetry = originalRequest.headers["X-Custom-Retry"] === "true";

    if (status === 401 && refreshToken && !isRetry) {
      originalRequest.headers["X-Custom-Retry"] = "true";

      const newToken = await refreshAccessTokenDelivery(refreshToken);

      if (newToken) {
        localStorage.setItem("deliveryAccessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return AxiosDelivery(originalRequest);
      }
    }

    if (status === 401 || status === 403) {
      toast.error(
        "Phiên delivery hết hạn hoặc không đủ quyền. Vui lòng đăng nhập lại."
      );
      localStorage.removeItem("deliveryAccessToken");
      localStorage.removeItem("deliveryRefreshToken");
      setTimeout(() => {
        window.location.href = "/nhan-vien-giao-hang/dang-nhap";
      }, 800);
    }

    return Promise.reject(error);
  }
);

export default AxiosDelivery;
