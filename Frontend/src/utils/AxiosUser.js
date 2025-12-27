import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";
import toast from "react-hot-toast";

const refreshAccessTokenUser = async (refreshToken) => {
  try {
    const response = await axios({
      url: baseURL + SummaryApi.refreshToken.url,
      method: SummaryApi.refreshToken.method,
      withCredentials: true,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (response.data.success) {
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }
    return null;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");

    if (window.location.pathname !== "/dang-nhap") {
      window.location.href = "/dang-nhap";
    }

    // toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
    return null;
  }
};

const AxiosUser = axios.create({
  baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

AxiosUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

AxiosUser.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      toast.error(
        "Không kết nối được đến server. Vui lòng kiểm tra kết nối mạng."
      );
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const refreshToken = localStorage.getItem("refreshToken");

    if (status === 401 && refreshToken && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return AxiosUser(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessTokenUser(refreshToken);

        if (newToken) {
          AxiosUser.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return AxiosUser(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      toast.error("Bạn không có quyền truy cập tính năng này");
    } else if (status === 404) {
      console.error("API không tồn tại:", originalRequest.url);
    } else if (status >= 500) {
      toast.error("Lỗi server. Vui lòng thử lại sau");
    }

    return Promise.reject(error);
  }
);

export default AxiosUser;
