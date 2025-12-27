import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import toast from "react-hot-toast";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();
  const timerRef = useRef(null);

  const startCountdown = (initialTime = 60) => {
    setCountdown(initialTime);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCountdown((prev) =>
        prev <= 1 ? (clearInterval(timerRef.current), 0) : prev - 1
      );
    }, 1000);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/quen-mat-khau");
      return;
    }

    setEmail(location.state.email);
    startCountdown(location.state?.countdown || 60);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: { otp: otp.join(""), email },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success(response.data.message);
      setOtp(["", "", "", "", "", ""]);
      navigate("/dat-lai-mat-khau", { state: { data: response.data, email } });
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) {
      toast.error(`Vui lòng đợi ${countdown} giây`);
      return;
    }

    try {
      setResendLoading(true);
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: { email },
      });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      toast.success("Đã gửi lại mã OTP!");
      setOtp(["", "", "", "", "", ""]);
      startCountdown();
      inputRef.current[0]?.focus();
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const numValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numValue;
    setOtp(newOtp);

    if (numValue && index < 5) inputRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    if (!paste) return;

    const pasteArr = paste.slice(0, 6).split("");
    const newOtp = [...otp];

    pasteArr.forEach((char, i) => {
      if (index + i < 6) newOtp[index + i] = char;
    });

    setOtp(newOtp);
    const nextIndex = Math.min(index + pasteArr.length - 1, 5);
    inputRef.current[nextIndex]?.focus();
  };

  const isValidOtp = otp.every((el) => el);

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-12">
      <Header />

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold uppercase text-red-500 mb-2">
            Xác thực OTP
          </h2>
          <p className="text-sm text-gray-500">
            Nhập mã xác minh đã gửi đến email
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhập OTP
            </label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputRef.current[index] = ref)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handlePaste(index, e)}
                  maxLength={1}
                  className="bg-blue-50 w-full max-w-16 p-2 border rounded outline-none focus:border-red-500 text-center font-semibold"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValidOtp || loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition duration-200 flex justify-center items-center
              ${
                isValidOtp
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                Đang xác minh...
              </>
            ) : (
              "Xác minh OTP"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Không nhận được mã?{" "}
            {countdown > 0 ? (
              <span className="font-semibold text-red-500">
                Gửi lại sau {countdown}s
              </span>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-red-500 hover:text-red-600 font-semibold underline ml-1"
              >
                {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
              </button>
            )}
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bạn đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-red-500 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
