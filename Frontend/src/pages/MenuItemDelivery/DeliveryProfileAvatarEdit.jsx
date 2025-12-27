import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AxiosDelivery from "../../utils/AxiosDelivery";
import SummaryApi from "../../common/SummaryApi";
import AxiosToastError from "../../utils/AxiosToastError";
import { updateProfile } from "../../store/userSlice";
import { IoClose } from "react-icons/io5";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

const DeliveryProfileAvatarEdit = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh (JPG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh tối đa là 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatarImage = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh trước");
      return;
    }

    const formData = new FormData();
    formData.append("img", selectedFile);

    try {
      setLoading(true);

      const response = await AxiosDelivery({
        ...SummaryApi.uploadDeliveryProfile,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        dispatch(updateProfile(response.data.data));
        toast.success("Cập nhật ảnh đại diện thành công!");
        close();
      }
    } catch (error) {
      console.error("Upload error:", error);
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUploadAvatarImage();
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[10000] p-4"
      onClick={close}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Thay đổi ảnh đại diện
          </h3>
          <button
            onClick={close}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Đóng"
            disabled={loading}
          >
            <IoClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-40 h-40 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-4 border-white shadow-lg mb-4">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={user.name || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaRegUserCircle className="w-24 h-24 text-gray-400" />
              )}
            </div>
            <p className="text-gray-600 text-sm text-center">
              Ảnh nên là hình vuông, định dạng JPG, PNG, WebP
              <br />
              Kích thước tối đa 5MB
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="uploadDeliveryProfile"
                className={`block w-full px-4 py-3 text-center rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  loading
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
                }`}
              >
                {loading ? "Đang tải lên..." : "Chọn ảnh từ máy tính"}
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                id="uploadDeliveryProfile"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                disabled={loading}
              />
            </div>

            {previewImage && !loading && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setSelectedFile(null);
                    const fileInput = document.getElementById(
                      "uploadDeliveryProfile"
                    );
                    if (fileInput) fileInput.value = "";
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Xác nhận thay đổi
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={close}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 disabled:opacity-50"
          >
            Đóng
          </button>
        </div>

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-700">Đang tải ảnh lên...</p>
              <p className="text-gray-500 text-sm mt-1">
                Vui lòng chờ trong giây lát
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default DeliveryProfileAvatarEdit;
