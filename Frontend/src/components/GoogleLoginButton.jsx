import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "../utils/AxiosUser";
import { toast } from "react-hot-toast";
import google from "../assets/google.png";

const GoogleLoginButton = () => {
  const handleSuccess = async (credentialResponse) => {
    const tokenId = credentialResponse?.credential;
    if (!tokenId) {
      toast.error("Không nhận được id_token từ Google");
      return;
    }

    try {
      const res = await axios.post("/api/auth/google", { tokenId });
      if (res.data.success) {
        toast.success("Đăng nhập Google thành công!");
        localStorage.setItem("accessToken", res.data.data.accessToken);
        localStorage.setItem("refreshToken", res.data.data.refreshToken);
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        toast.error(res.data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập!"
      );
    }
  };

  const handleError = () => {
    toast.error("Đăng nhập Google thất bại");
  };

  return (
    <div className="w-full mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        render={({ onClick, disabled }) => (
          <button
            onClick={onClick}
            disabled={disabled}
            className="w-full bg-white border border-gray-300 rounded-md py-2 text-black flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img src={google} alt="Google" className="w-5 h-5" />
            <span>Đăng nhập bằng Google</span>
          </button>
        )}
      />
    </div>
  );
};

export default GoogleLoginButton;
