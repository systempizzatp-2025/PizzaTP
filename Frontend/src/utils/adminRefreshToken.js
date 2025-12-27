import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi.js";
import toast from "react-hot-toast";

export const refreshAccessTokenAdmin = async (refreshToken) => {
  try {
    const response = await axios({
      url: baseURL + SummaryApi.refreshTokenAdmin.url,
      method: SummaryApi.refreshTokenAdmin.method,
      withCredentials: true,
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const newAccessToken = response.data.data.accessToken;
    localStorage.setItem("adminAccessToken", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Admin Refresh Token Failed:", error);
    localStorage.clear();
    toast.error("Phiên QTV hết hạn. Vui lòng đăng nhập lại.");
    setTimeout(() => {
      window.location.href = "/quan-tri-vien/dang-nhap";
    }, 500);
    return null;
  }
};
