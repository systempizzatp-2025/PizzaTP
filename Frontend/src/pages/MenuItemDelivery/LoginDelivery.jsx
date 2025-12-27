import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../../utils/AxiosDelivery";
import SummaryApi from "../../common/SummaryApi";

import AxiosToastError from "../../utils/AxiosToastError";
import fetchDeliveryDetails from "../../utils//fetchDeliveryDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/userSlice";

const LoginDelivery = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) return;

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.loginDelivery,
        data,
        withCredentials: true,
      });

      const resData = response?.data;

      if (resData.error) {
        toast.error(resData.message);
        return;
      }

      if (resData.success && resData.data) {
        toast.success(resData.message);

        const { accessToken, refreshToken } = resData.data;

        localStorage.setItem("deliveryAccessToken", accessToken);
        localStorage.setItem("deliveryRefreshToken", refreshToken);

        const deliveryDetailsResponse = await fetchDeliveryDetails(accessToken);

        const userDetailsData = deliveryDetailsResponse?.data?.data;

        if (!userDetailsData) {
          toast.error("Không thể lấy thông tin chi tiết nhân viên giao hàng.");
          localStorage.clear();
          return;
        }

        dispatch(setUserDetails(userDetailsData));

        setData({ email: data.email, password: "" });
        navigate("/nhan-vien-giao-hang/bang-dieu-khien");
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const valideValue = data.email && data.password;

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-10">
        <div className="flex items-center gap-2 mb-6 justify-center text-red-500">
          <h2 className="text-2xl font-bold uppercase">ĐĂNG NHẬP</h2>
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
              className="absolute inset-y-11 right-3 flex items-center text-gray-400 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <FaRegEye size={20} />
              ) : (
                <FaRegEyeSlash size={20} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={!valideValue || loading}
            className={`${
              valideValue
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            } w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
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
        </form>
      </div>
    </div>
  );
};

export default LoginDelivery;
