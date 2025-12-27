import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi.js";
import toast from "react-hot-toast";

export const refreshAccessTokenDelivery = async (refreshToken) => {
  try {
    const response = await axios({
      url: baseURL + SummaryApi.refreshTokenDelivery.url,
      method: SummaryApi.refreshTokenDelivery.method,
      withCredentials: true,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const newAccessToken = response.data.data.accessToken;
    localStorage.setItem("deliveryAccessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Delivery Refresh Token Failed:", error);
    localStorage.clear();
    toast.error("Phiên NVGH hết hạn. Vui lòng đăng nhập lại.");
    setTimeout(() => {
      window.location.href = "/nhan-vien-giao-hang/dang-nhap";
    }, 500);
    return null;
  }
};
