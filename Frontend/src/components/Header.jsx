import React, { useState, useEffect, useRef } from "react";
import { User, ShoppingCart, Menu, X, Bell } from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo_tp.png";
import Search from "./Search.jsx";
import { useSelector } from "react-redux";
import HeaderUserMenu from "./HeaderUserMenu";
import NotificationBell from "./NotificationBell.jsx";
import HeaderRoleMenu from "./HeaderRoleMenu.jsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const cartItem = useSelector((state) => state.cartItem.cart);

  const menuItems = [
    { name: "Trang Chủ", path: "/" },
    { name: "Giới thiệu", path: "/gioi-thieu" },
    { name: "Dịch Vụ", path: "/dich-vu" },
    { name: "Thực Đơn", path: "/thuc-don" },
    { name: "Mã Giảm Giá", path: "/ma-giam-gia" },
    { name: "Tin Tức", path: "/tin-tuc" },
  ];

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    const handleStorageChange = () => checkLoginStatus();

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setOpenUserMenu(false);
    setOpenNotifications(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isUserMenuClick = userMenuRef.current?.contains(e.target);
      const isNotificationClick = notificationRef.current?.contains(e.target);

      if (!isUserMenuClick) setOpenUserMenu(false);
      if (!isNotificationClick) setOpenNotifications(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOpenUserMenu(false);
    setOpenNotifications(false);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleUserIconClick = (e) => {
    e.stopPropagation();
    setOpenNotifications(false);

    setOpenUserMenu((prev) => !prev);
  };

  // const handleNotificationClick = (e) => {
  //   e.stopPropagation();
  //   setOpenUserMenu(false);
  //   setOpenNotifications((prev) => !prev);
  // };

  const handleCartClick = () => {
    setOpenUserMenu(false);
    setOpenNotifications(false);
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50 transition-all duration-300">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-12 h-12" />
        </Link>

        <ul className="hidden lg:flex items-center space-x-8 uppercase text-sm font-semibold text-gray-900 dark:text-gray-100">
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                className="hover:text-red-500 transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center space-x-4 text-gray-900 dark:text-gray-100 relative">
          <Search />

          {isLoggedIn && <NotificationBell />}

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={handleUserIconClick}
              className="flex items-center hover:text-red-500 transition-colors"
            >
              <User size={22} />
            </button>

            {openUserMenu && (
              <div className="absolute top-12 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-56 z-50 border border-gray-200">
                {isLoggedIn ? (
                  <HeaderUserMenu
                    key="header-usermenu"
                    closeMenu={() => setOpenUserMenu(false)}
                  />
                ) : (
                  <HeaderRoleMenu closeMenu={() => setOpenUserMenu(false)} />
                )}
              </div>
            )}
          </div>

          <Link
            to={"/gio-hang"}
            className="hover:text-red-500 transition-colors relative"
            onClick={handleCartClick}
          >
            <ShoppingCart size={22} />
            {cartItem && cartItem.length > 0 && (
              <p className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItem.length}
              </p>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:text-red-500 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-95 z-40 flex flex-col items-center justify-center transform transition-transform duration-500 ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-gray-700 dark:text-gray-100"
        >
          <X size={30} />
        </button>

        <ul className="flex flex-col items-center space-y-6 text-2xl uppercase font-semibold text-gray-900 dark:text-gray-100 text-center">
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link
                to={item.path}
                onClick={handleMobileLinkClick}
                className="hover:text-red-500 transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {!isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/dang-nhap"
                  onClick={handleMobileLinkClick}
                  className="hover:text-red-500 transition-colors"
                >
                  Đăng Nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/dang-ky"
                  onClick={handleMobileLinkClick}
                  className="hover:text-red-500 transition-colors"
                >
                  Đăng Ký
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenUserMenu(true);
                }}
                className="hover:text-red-500 transition-colors"
              >
                Tài Khoản
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
