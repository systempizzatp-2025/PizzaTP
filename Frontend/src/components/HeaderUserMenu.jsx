import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import { logout } from "../store/userSlice";
import { handleClearCart } from "../store/cartProduct";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import { useLogoutModal } from "./LogoutModalManager";

const HeaderUserMenu = ({ closeMenu }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showModal } = useLogoutModal();



  const handleLogout = useCallback(async () => {
    try {
      await Axios({ ...SummaryApi.logout, withCredentials: true });
  

      dispatch(logout());
      dispatch(handleClearCart());
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      toast.success("Đăng xuất thành công");
      navigate("/");

      if (typeof closeMenu === "function") closeMenu();
    } catch (error) {
      AxiosToastError(error);
    }
  }, [dispatch, navigate, closeMenu]);

  const handleLogoutClick = useCallback(() => {
    showModal({
      onConfirm: handleLogout,
      onCancel: () => {
        if (typeof closeMenu === "function") {
          closeMenu();
        }
      },
      title: "Xác nhận đăng xuất",
      message: "Cái gì vại chòi? Bạn có chắc chắn muốn đăng xuất không?",
    });
  }, [showModal, handleLogout, closeMenu]);

  return (
    <div className="text-gray-800 dark:text-gray-100">
      <ul className="space-y-2">
        <li>
          <Link
            to="/nguoi-dung/bang-dieu-khien/tai-khoan-cua-toi"
            onClick={closeMenu}
            className="block hover:bg-red-200 transition-colors px-2 py-1 rounded"
          >
            Tài khoản của tôi
          </Link>
        </li>
        <li>
          <Link
            to="/nguoi-dung/bang-dieu-khien/theo-doi-don-hang"
            onClick={closeMenu}
            className="block hover:bg-red-200 transition-colors px-2 py-1 rounded"
          >
            Theo dõi đơn hàng
          </Link>
        </li>
        <li>
          <Link
            to="/nguoi-dung/bang-dieu-khien/don-hang-da-dat"
            onClick={closeMenu}
            className="block hover:bg-red-200 transition-colors px-2 py-1 rounded"
          >
            Đơn hàng đã đặt
          </Link>
        </li>
        <li>
          <Link
            to="/nguoi-dung/bang-dieu-khien/luu-dia-chi"
            onClick={closeMenu}
            className="block hover:bg-red-200 transition-colors px-2 py-1 rounded"
          >
            Lưu địa chỉ
          </Link>
        </li>
        <li>
          <Link
            to="/nguoi-dung/bang-dieu-khien/san-pham-yeu-thich"
            onClick={closeMenu}
            className="block hover:bg-red-200 transition-colors px-2 py-1 rounded"
          >
            Sản phẩm yêu thích
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogoutClick}
            className="w-full text-left block hover:bg-red-200 transition-colors px-2 py-1 rounded text-red-600 font-medium"
          >
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  );
};

export default HeaderUserMenu;
