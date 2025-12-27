import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import AxiosDelivery from "../../utils/AxiosDelivery";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { setUserDetails } from "../../store/userSlice";
import DeliveryProfileAvatarEdit from "./DeliveryProfileAvatarEdit";
import { createPortal } from "react-dom";

const Loading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ProfileDelivery = ({ close }) => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    profile_image: "",
    gender: "",
    birth_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AxiosDelivery({
          url: SummaryApi.userDetailsDelivery.url,
          method: SummaryApi.userDetailsDelivery.method,
        });

        if (response.data.success) {
          const u = response.data.data;
          setUserData({
            name: u.name || "",
            email: u.email || "",
            mobile: u.mobile || "",
            profile_image: u.profile_image || "",
            gender: u.gender || "",
            birth_date: u.birth_date || "",
          });
          dispatch(setUserDetails(u));
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin shipper:", err);
        toast.error("Lấy thông tin shipper thất bại!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await AxiosDelivery({
        url: SummaryApi.updateDeliveryDetails.url,
        method: SummaryApi.updateDeliveryDetails.method,
        data: userData,
      });

      if (response.data.success) {
        toast.success("Cập nhật thông tin thành công!");

        const freshResponse = await AxiosDelivery({
          url: SummaryApi.userDetailsDelivery.url,
          method: SummaryApi.userDetailsDelivery.method,
        });
        if (freshResponse.data.success) {
          dispatch(setUserDetails(freshResponse.data.data));
        }
        if (close) close();
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  if (!mounted) return null;

  if (loading)
    return createPortal(
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <Loading />
      </div>,
      document.body
    );

  const modalContent = (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollBarCustom"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Thông tin shipper
            </h2>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Đóng"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
                  {userRedux.profile_image ? (
                    <img
                      src={userRedux.profile_image}
                      alt={userRedux.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaRegUserCircle className="text-gray-400 w-20 h-20" />
                  )}
                </div>
                <button
                  onClick={() => setOpenAvatarEdit(true)}
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  aria-label="Thay đổi ảnh đại diện"
                >
                  <span className="text-sm">✎</span>
                </button>
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {userData.name}
              </h3>
              <p className="text-gray-600">Shipper</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    value={userData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formatDateForInput(userData.birth_date)}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Giới tính
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={userData.gender === "male"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-gray-700">Nam</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={userData.gender === "female"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-gray-700">Nữ</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={userData.gender === "other"}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-gray-700">Khác</span>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Thông tin shipper
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Trạng thái:</span>
                    <span className="ml-2 font-medium text-green-600">
                      Đang hoạt động
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-600">ID Shipper:</span>
                    <span className="ml-2 font-mono">
                      #{userRedux._id?.substring(0, 8) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {submitting ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {openAvatarEdit && (
        <DeliveryProfileAvatarEdit close={() => setOpenAvatarEdit(false)} />
      )}
    </>
  );

  return createPortal(modalContent, document.body);
};

export default ProfileDelivery;
