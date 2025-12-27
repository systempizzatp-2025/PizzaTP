import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (rememberMe) {
      const savedEmail = localStorage.getItem("savedEmail");
      if (savedEmail) setData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, [rememberMe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) return;

    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.login, data });
      const resData = response?.data;

      if (resData.error) {
        toast.error(resData.message);
        return;
      }

      if (resData.success && resData.data) {
        toast.success(resData.message);
        const { accesstoken, refreshToken } = resData.data;

        localStorage.setItem("accessToken", accesstoken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (rememberMe ? 7 : 1));
        localStorage.setItem("tokenExpiry", expiryDate.getTime());

        if (rememberMe) {
          localStorage.setItem("savedEmail", data.email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data.data));
        setData({ email: data.email, password: "" });
        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-12">
      <Header />
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-10">
        <div className="flex items-center gap-2 mb-6 justify-center text-red-500">
          <h2 className="text-2xl font-bold uppercase">Đăng nhập</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Nhập email của bạn"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-11 right-3 flex items-center text-gray-400 hover:text-gray-700"
            >
              {showPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => {
                  setRememberMe(e.target.checked);
                  if (!e.target.checked) localStorage.removeItem("savedEmail");
                }}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-900"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link
              to="/quen-mat-khau"
              className="text-sm text-red-500 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!data.email || !data.password || loading}
            className={`${
              data.email && data.password
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            }
              w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </button>

          <GoogleLoginButton />
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bạn chưa có tài khoản?{" "}
          <Link to="/dang-ky" className="text-red-500 hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
