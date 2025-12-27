import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MdDashboard,
  MdShoppingCart,
  MdInventory,
  MdCategory,
  MdPeople,
  MdLocalOffer,
  MdDeliveryDining,
  MdStar,
  MdNotifications,
  MdMenu,
  MdClose,
  MdExpandMore,
  MdTrendingUp,
  MdTrendingDown,
  MdLogout,
  MdAttachMoney,
  MdStore,
  MdPerson,
  MdShoppingBag,
  MdOutlineInventory2,
  MdClose as MdCloseIcon,
  MdReceipt,
  MdPayment,
  MdRateReview,
  MdAnalytics,
  MdAdd,
  MdChat,
} from "react-icons/md";
import {
  FaFileExcel,
  FaChartLine,
  FaUsers,
  FaBoxes,
  FaCreditCard,
} from "react-icons/fa";
import logo from "../assets/logo_tp.png";

// import { logout } from "../store/userSlice";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosAdmin";
import toast from "react-hot-toast";
import BarChartAdmin from "../pages/BarChartAdmin";
import ExportModal from "../components/ExportModal";
const DashboardAdmin = () => {
  // const user = useSelector((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const location = useLocation();
  // const dispatch = useDispatch();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("adminRefreshToken");

    try {
      await Axios({
        ...SummaryApi.logoutAdmin,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");

      toast.success("Đăng xuất thành công!");

      window.location.href = "/quan-tri-vien/dang-nhap";
    } catch (error) {
      AxiosToastError(error);

      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
    }
  };

  const toggleSubmenu = (key) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const MenuItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.key];
    const isActive =
      location.pathname === item.to ||
      (item.children &&
        item.children.some((child) => location.pathname === child.to));

    return (
      <div className="mb-1">
        {hasChildren ? (
          <button
            onClick={() => toggleSubmenu(item.key)}
            className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
              isActive
                ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              <span className="font-medium text-xs sm:text-sm">
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {item.badge && (
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              )}
            </div>
          </button>
        ) : (
          <Link
            to={item.to}
            className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
              isActive
                ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
              <span className="font-medium text-xs sm:text-sm">
                {item.label}
              </span>
            </div>
            {item.badge && (
              <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasChildren && (
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
              {item.children.map((child, idx) => {
                const isChildActive = location.pathname === child.to;
                return (
                  <Link
                    key={idx}
                    to={child.to}
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      isChildActive
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      {child.icon && (
                        <span className="text-xs">{child.icon}</span>
                      )}
                      <span className="break-words">{child.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isDashboardPage =
    location.pathname === "/quan-tri-vien/bang-dieu-khien";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
        <div className="px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-orange-50 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <MdClose className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              ) : (
                <MdMenu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              )}
            </button>
            <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto" />
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent hidden sm:block">
              Pizza Admin
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsExportMenuOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
            >
              <FaFileExcel className="text-sm sm:text-lg" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </button>
            <ExportModal
              isOpen={isExportMenuOpen}
              onClose={() => setIsExportMenuOpen(false)}
            />

            <button className="relative p-1.5 sm:p-2.5 hover:bg-orange-50 rounded-xl transition-all duration-300">
              <MdNotifications className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="absolute top-1 right-1 sm:top-2 sm:right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></span>
            </button>
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 text-xs sm:text-sm"
              >
                <MdLogout className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:block font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden lg:block w-64 xl:w-72 bg-white/80 backdrop-blur-md border-r border-gray-100 sticky top-14 sm:top-16 self-start h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <nav className="p-3 sm:p-4 space-y-1">
            <Link
              to="/quan-tri-vien/bang-dieu-khien"
              className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                location.pathname === "/quan-tri-vien/bang-dieu-khien"
                  ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                  : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MdDashboard className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-xs sm:text-sm">Dashboard</span>
            </Link>
            <div className="mb-1">
              <Link
                to="/quan-tri-vien/bang-dieu-khien/phan-hoi-khach-hang"
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/phan-hoi-khach-hang"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdChat className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Phản hồi khách hàng
                  </span>
                </div>
              </Link>
            </div>
            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("orders")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/don-hang"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdReceipt className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Quản lý đơn hàng
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["orders"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["orders"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/don-hang-cho-giao"
                    className="block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Chờ giao
                  </Link>

                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/don-hang-dang-giao"
                    className="block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đang giao
                  </Link>

                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/don-hang-da-giao"
                    className="block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đã giao
                  </Link>
                </div>
              </div>
            </div>
            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("products")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/san-pham"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdOutlineInventory2 className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Sản phẩm
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["products"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["products"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/danh-sach-san-pham"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/danh-sach-san-pham"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Danh sách sản phẩm
                  </Link>

                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/them-san-pham-moi"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/them-san-pham-moi"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdAdd className="text-xs" />
                      <span>Thêm sản phẩm mới</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("categories")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/danh-muc"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdCategory className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Danh mục
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["categories"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["categories"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/danh-muc-chinh"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/danh-muc-chinh"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Danh mục chính
                  </Link>
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/danh-muc-phu"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/danh-muc-phu"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Danh mục phụ
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("users")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/quan-ly-nguoi-dung"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdPeople className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Quản lý Người dùng
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["users"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["users"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/tat-ca-nguoi-dung"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/tat-ca-nguoi-dung"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tất cả người dùng
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("coupons")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/ma-giam-gia"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdLocalOffer className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Mã giảm giá
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["coupons"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["coupons"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/danh-sach-ma-giam-gia"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/danh-sach-ma-giam-gia"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Danh sách mã giảm giá
                  </Link>
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/tao-ma-giam-gia"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/tao-ma-giam-gia"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdAdd className="text-xs" />
                      <span>Tạo mã mới</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("reviews")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/danh-gia"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdRateReview className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Đánh giá
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["reviews"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["reviews"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/tat-ca-danh-gia"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/tat-ca-danh-gia"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tất cả đánh giá
                  </Link>
                </div>
              </div>
            </div>

            <div className="mb-1">
              <button
                onClick={() => toggleSubmenu("notifications")}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname.startsWith(
                    "/quan-tri-vien/bang-dieu-khien/thong-bao"
                  )
                    ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                    : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <MdNotifications className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-xs sm:text-sm">
                    Thông báo
                  </span>
                </div>
                <span
                  className="transition-transform duration-300 text-sm sm:text-base"
                  style={{
                    transform: expandedMenus["notifications"]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <MdExpandMore />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedMenus["notifications"]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/gui-thong-bao"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/gui-thong-bao"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdAdd className="text-xs" />
                      <span>Gửi thông báo</span>
                    </div>
                  </Link>
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien/lich-su-thong-bao"
                    className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                      location.pathname ===
                      "/quan-tri-vien/bang-dieu-khien/lich-su-thong-bao"
                        ? "text-orange-600 bg-orange-50 font-medium"
                        : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Lịch sử thông báo
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <aside className="lg:hidden w-64 sm:w-72 bg-white fixed left-0 top-0 sm:top-16 bottom-0 overflow-y-auto z-50 shadow-2xl transform transition-transform duration-300 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="h-full">
                <nav className="p-3 sm:p-4 space-y-1">
                  <Link
                    to="/quan-tri-vien/bang-dieu-khien"
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                      location.pathname === "/quan-tri-vien/bang-dieu-khien"
                        ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                        : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MdDashboard className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium text-xs sm:text-sm">
                      Dashboard
                    </span>
                  </Link>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("products")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/san-pham"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdOutlineInventory2 className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Sản phẩm
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["products"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["products"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/danh-sach-san-pham"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/danh-sach-san-pham"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Danh sách sản phẩm
                        </Link>
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/them-san-pham-moi"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/them-san-pham-moi"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <MdAdd className="text-xs" />
                            <span>Thêm sản phẩm mới</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("categories")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/danh-muc"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdCategory className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Danh mục
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["categories"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["categories"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/danh-muc-chinh"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/danh-muc-chinh"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Danh mục chính
                        </Link>
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/danh-muc-phu"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/danh-muc-phu"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Danh mục phụ
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("users")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/quan-ly-nguoi-dung"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdPeople className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Quản lý Người dùng
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["users"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["users"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/tat-ca-nguoi-dung"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/tat-ca-nguoi-dung"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Tất cả người dùng
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("coupons")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/ma-giam-gia"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdLocalOffer className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Mã giảm giá
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["coupons"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["coupons"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/danh-sach-ma-giam-gia"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/danh-sach-ma-giam-gia"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Danh sách mã giảm giá
                        </Link>
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/tao-ma-moi"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/tao-ma-moi"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <MdAdd className="text-xs" />
                            <span>Tạo mã mới</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("reviews")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/danh-gia"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdRateReview className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Đánh giá
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["reviews"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["reviews"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/tat-ca-danh-gia"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/tat-ca-danh-gia"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Tất cả đánh giá
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <button
                      onClick={() => toggleSubmenu("notifications")}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all duration-300 group ${
                        location.pathname.startsWith(
                          "/quan-tri-vien/bang-dieu-khien/thong-bao"
                        )
                          ? "text-orange-600 bg-gradient-to-r from-orange-50 to-orange-25"
                          : "text-gray-600 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <MdNotifications className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-medium text-xs sm:text-sm">
                          Thông báo
                        </span>
                      </div>
                      <span
                        className="transition-transform duration-300 text-sm sm:text-base"
                        style={{
                          transform: expandedMenus["notifications"]
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <MdExpandMore />
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedMenus["notifications"]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-8 sm:ml-11 mt-1 space-y-1 border-l-2 border-gray-100 pl-2 sm:pl-3">
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/gui-thong-bao"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/gui-thong-bao"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <MdAdd className="text-xs" />
                            <span>Gửi thông báo</span>
                          </div>
                        </Link>
                        <Link
                          to="/quan-tri-vien/bang-dieu-khien/lich-su-thong-bao"
                          className={`block w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 ${
                            location.pathname ===
                            "/quan-tri-vien/bang-dieu-khien/lich-su-thong-bao"
                              ? "text-orange-600 bg-orange-50 font-medium"
                              : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Lịch sử thông báo
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </aside>
          </>
        )}

        <main className="flex-1 min-h-screen w-full">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="max-w-7xl mx-auto">
              {isDashboardPage ? (
                <div className="space-y-4 sm:space-y-6">
                  <BarChartAdmin />
                </div>
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        @media (min-width: 475px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardAdmin;
