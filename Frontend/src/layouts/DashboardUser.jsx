import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import UserMenu from "../components/UserMenu";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { logout } from "../store/userSlice";
import { handleClearCart } from "../store/cartProduct";
import toast from "react-hot-toast";

const DashboardUser = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const getUserAvatar = () => {
    if (user?.profile_image) {
      return (
        <img
          src={user.profile_image}
          alt={user.name || "User"}
          className="w-10 h-10 rounded-full object-cover border-2 border-white"
        />
      );
    }

    const getAvatarInitial = () => {
      if (user?.name) return user.name.charAt(0).toUpperCase();
      if (user?.email) return user.email.charAt(0).toUpperCase();
      return "U";
    };

    const initial = getAvatarInitial();
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold">
        {initial}
      </div>
    );
  };

  const getUserAvatarMobile = () => {
    if (user?.profile_image) {
      return (
        <img
          src={user.profile_image}
          alt={user.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-white"
        />
      );
    }

    const getAvatarInitial = () => {
      if (user?.name) return user.name.charAt(0).toUpperCase();
      if (user?.email) return user.email.charAt(0).toUpperCase();
      return "TP";
    };

    const initial = getAvatarInitial();
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
        {initial}
      </div>
    );
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) {
      const emailPart = user.email.split("@")[0];
      return emailPart.length > 15
        ? emailPart.substring(0, 15) + "..."
        : emailPart;
    }
    if (user?.phone) return user.phone;
    return "Khách hàng";
  };

  const getBreadcrumb = () => {
    const path = location.pathname;

    const breadcrumbMap = {
      "/nguoi-dung/bang-dieu-khien/tai-khoan-cua-toi": "Tài khoản của tôi",
      "/nguoi-dung/bang-dieu-khien/don-hang-da-dat": "Đơn hàng đã đặt",
      "/nguoi-dung/bang-dieu-khien/luu-dia-chi": "Lưu địa chỉ",
      "/nguoi-dung/bang-dieu-khien/san-pham-yeu-thich": "Sản phẩm yêu thích",
    };

    for (const [route, name] of Object.entries(breadcrumbMap)) {
      if (path.startsWith(route)) {
        return name;
      }
    }

    return "Tài khoản của tôi";
  };

  const currentBreadcrumb = getBreadcrumb();

  return (
    <section className="bg-gray-50 min-h-screen pt-20">
      <Header />
      <div className="container mx-auto px-4 py-5">
        <div className="mb-4">
          <nav className="flex text-sm text-gray-500 mb-2">
            <Link to="/" className="hover:text-red-500">
              Trang chủ
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-medium">
              {currentBreadcrumb}
            </span>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {getUserAvatar()}
                  <div>
                    <p
                      className="font-semibold text-gray-800  text-ellipsis line-clamp-1"
                      title={user?.email || user?.name || "Khách hàng"}
                    >
                      {getDisplayName()}
                    </p>
                    {user?.email && (
                      <p
                        className="text-xs text-gray-500 truncate"
                        title={user.email}
                      >
                        {user.email.length > 20
                          ? user.email.substring(0, 20) + "..."
                          : user.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-2">
                <UserMenu />
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="md:hidden p-3 border-b border-gray-100">
                <button
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    {getUserAvatar()}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {getDisplayName()}
                      </p>
                      {user?.email && (
                        <p
                          className="text-xs text-gray-500 truncate"
                          title={user.email}
                        >
                          {user.email.length > 25
                            ? user.email.substring(0, 25) + "..."
                            : user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-white shadow-xl">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Tài khoản của tôi
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-red-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto scrollBarCustom h-full pb-16">
              <div className="p-3 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {getUserAvatarMobile()}
                  <div>
                    <p className="font-semibold text-gray-800">
                      {getDisplayName()}
                    </p>
                    {user?.email && (
                      <p
                        className="text-sm text-gray-500 truncate"
                        title={user.email}
                      >
                        {user.email.length > 25
                          ? user.email.substring(0, 25) + "..."
                          : user.email}
                      </p>
                    )}
                    {user?.phone && (
                      <p className="text-sm text-gray-500">SĐT: {user.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <UserMenu closeMenu={() => setIsMobileMenuOpen(false)} />
              </div>
              <div className="mt-4 px-3"></div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default DashboardUser;
