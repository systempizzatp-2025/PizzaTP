import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderRoleMenu = ({ closeMenu }) => {
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    window.open(path, "_blank");
    if (closeMenu) closeMenu();
  };
  const handleNavigates = (path) => {
    navigate(path);
    if (closeMenu) closeMenu();
  };
  return (
    <ul className="space-y-2">
      <li>
        <button
          onClick={() => handleNavigates("/dang-nhap")}
          className="w-full text-left px-2 py-1 rounded hover:bg-red-200 transition-colors"
        >
          Đăng nhập
        </button>
      </li>
      <li>
        <button
          onClick={() => handleNavigate("/quan-tri-vien/dang-nhap")}
          className="w-full text-left px-2 py-1 rounded hover:bg-red-200 transition-colors"
        >
          Quản trị viên
        </button>
      </li>
      <li>
        <button
          onClick={() => handleNavigate("/nhan-vien-giao-hang/dang-nhap")}
          className="w-full text-left px-2 py-1 rounded hover:bg-red-200 transition-colors"
        >
          Nhân viên
        </button>
      </li>
    </ul>
  );
};

export default HeaderRoleMenu;
