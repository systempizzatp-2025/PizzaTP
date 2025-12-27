import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { UserPlus } from "lucide-react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) errors.push("Ít nhất 8 ký tự");
    if (!/[A-Z]/.test(password)) errors.push("1 chữ hoa");
    if (!/[a-z]/.test(password)) errors.push("1 chữ thường");
    if (!/[0-9]/.test(password)) errors.push("1 chữ số");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("1 ký tự đặc biệt");
    if (/\s/.test(password)) errors.push("Không chứa khoảng trắng");
    if (password.length > 32) errors.push("Tối đa 32 ký tự");
    
    return errors;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name) => {
    if (name.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự";
    if (name.trim().length > 50) return "Họ tên không được quá 50 ký tự";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
    
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(data.name);
    if (nameError) {
      toast.error(nameError);
      return;
    }

    if (!validateEmail(data.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (passwordErrors.length > 0) {
      toast.error("Mật khẩu chưa đủ mạnh");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Đang đăng ký...");

      const userData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        password: data.password,
      };

      const response = await Axios({
        ...SummaryApi.register,
        data: userData,
      });

      toast.dismiss(toastId);

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", email: "", password: "", confirmPassword: "" });
        setPasswordErrors([]);
        navigate("/dang-nhap");
      }

    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const valideValue = Object.values(data).every((el) => el);

  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center px-4 py-12">
      <Header />

      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mt-10">
        <div className="flex items-center gap-2 mb-6 justify-center text-red-500">
          <UserPlus size={32} />
          <h2 className="text-2xl font-bold uppercase">Đăng ký tài khoản</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              type="text"
              autoFocus
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Nhập họ tên của bạn"
            />
            {data.name && (
              <p className="text-xs text-gray-500 mt-1">{data.name.trim().length}/50 ký tự</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Nhập email của bạn"
            />
            {data.email && !validateEmail(data.email) && (
              <p className="text-xs text-red-500 mt-1">Email không hợp lệ</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                passwordErrors.length > 0 && data.password 
                  ? "border-red-500 focus:ring-red-300" 
                  : "focus:ring-red-400"
              }`}
              placeholder="Nhập mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-11 right-3 flex items-center text-gray-400 hover:text-gray-700"
            >
              {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </button>
        
            {data.password && passwordErrors.length > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Yêu cầu: {passwordErrors.join(", ")}
              </p>
            )}
            
            {!data.password && (
              <p className="text-xs text-gray-500 mt-1">
                Yêu cầu: 8 ký tự, chữ hoa/thường, số, ký tự đặc biệt
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                data.confirmPassword && data.password !== data.confirmPassword 
                  ? "border-red-500 focus:ring-red-300" 
                  : "focus:ring-red-400"
              }`}
              placeholder="Nhập lại mật khẩu"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-11 right-3 flex items-center text-gray-400 hover:text-gray-700"
            >
              {showConfirmPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
            </button>
            
            {data.confirmPassword && data.password !== data.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
            )}
            {data.confirmPassword && data.password === data.confirmPassword && (
              <p className="text-xs text-green-500 mt-1">✓ Mật khẩu khớp</p>
            )}
          </div>

          <button
            disabled={!valideValue || loading || passwordErrors.length > 0 || data.password !== data.confirmPassword}
            className={`${
              valideValue && passwordErrors.length === 0 && data.password === data.confirmPassword
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-400 cursor-not-allowed"
            } w-full text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Bạn đã có tài khoản?{" "}
          <Link to="/dang-nhap" className="text-red-500 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;