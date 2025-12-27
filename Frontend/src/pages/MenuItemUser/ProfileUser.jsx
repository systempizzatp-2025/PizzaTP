import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../../utils/AxiosUser";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import fetchUserDetails from "../../utils/fetchUserDetails";
import { setUserDetails } from "../../store/userSlice";
import UserProfileAvatarEdit from "./UserProfileAvatarEdit";

const Loading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
  </div>
);

const ProfileUser = () => {
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    profile_image: "",
    gender: "",
    birth_date: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchUserDetails();
        if (data?.data?.data) {
          const u = data.data.data;
          setUserData({
            name: u.name || "",
            email: u.email || "",
            mobile: u.mobile || "",
            profile_image: u.profile_image || "",
            gender: u.gender || "",
            birth_date: u.birth_date || "",
            address: u.address || "",
          });
          dispatch(setUserDetails(u));
        }
      } catch (err) {
        toast.error("Lấy dữ liệu người dùng thất bại!");
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
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });
      const { data } = response;
      if (data.success) {
        toast.success(data.message);
        const freshUser = await fetchUserDetails();
        dispatch(setUserDetails(freshUser.data.data));
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

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center drop-shadow-sm">
          {userRedux.profile_image ? (
            <img
              src={userRedux.profile_image}
              alt={userRedux.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaRegUserCircle className="text-gray-400" size={60} />
          )}
        </div>
        <div>
          <button
            onClick={() => setOpenAvatarEdit(true)}
            className="text-sm border border-red-200 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg transition-colors"
          >
            Chỉnh sửa ảnh
          </button>
        </div>
      </div>

      {openAvatarEdit && (
        <UserProfileAvatarEdit close={() => setOpenAvatarEdit(false)} />
      )}

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label htmlFor="name" className="font-medium text-gray-700">
            Họ và tên
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Nhập tên của bạn"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-gray-700">Giới tính</label>
          <div className="flex gap-3 mt-2 flex-wrap">
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-red-50">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userData.gender === "male"}
                onChange={handleChange}
                className="w-4 h-4 text-red-500"
              />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-red-50">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userData.gender === "female"}
                onChange={handleChange}
                className="w-4 h-4 text-red-500"
              />
              <span>Nữ</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg hover:bg-red-50">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={userData.gender === "other"}
                onChange={handleChange}
                className="w-4 h-4 text-red-500"
              />
              <span>Khác</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Nhập email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mobile" className="font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            value={userData.mobile}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-1 space-y-2">
          <label htmlFor="birth_date" className="font-medium text-gray-700">
            Ngày sinh
          </label>
          <input
            type="date"
            id="birth_date"
            name="birth_date"
            value={formatDateForInput(userData.birth_date)}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Đang cập nhật..." : "Cập nhật thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUser;
