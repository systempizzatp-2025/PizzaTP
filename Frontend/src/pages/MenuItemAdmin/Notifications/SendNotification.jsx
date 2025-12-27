import React, { useState, useRef } from "react";
import Axios from "../../../utils/AxiosAdmin";
import summaryApi from "../../../common/SummaryApi";
import { FaPaperPlane, FaImage, FaTimes, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";

const SendNotification = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "Info",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadImage = async () => {
    if (!file) return null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await Axios.post(summaryApi.uploadImage.url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data.data.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload ảnh thất bại!");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB!");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async () => {
    try {
      if (!form.title.trim() || !form.message.trim()) {
        return alert("Tiêu đề và nội dung không được để trống!");
      }

      let imageUrl = form.image;
      if (file) {
        const uploaded = await handleUploadImage();
        if (uploaded) imageUrl = uploaded;
      }

      await Axios.post(summaryApi.notifications.admin_create_global.url, {
        title: form.title,
        message: form.message,
        type: form.type,
        image: imageUrl,
      });

      toast.success("Gửi thông báo thành công!");
      setForm({ title: "", message: "", type: "Info", image: "" });
      setFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      toast.error("Gửi thất bại!");
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Promo":
        return "bg-yellow-500";
      case "Order":
        return "bg-green-500";
      case "System":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
        Gửi thông báo
      </h2>

      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề *
            </label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nhập tiêu đề thông báo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung *
            </label>
            <textarea
              className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows="4"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Nhập nội dung thông báo..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại thông báo
              </label>
              <select
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Info">Thông tin</option>
                <option value="Promo">Khuyến mãi</option>
                {/* <option value="Order">Đơn hàng</option> */}
                <option value="System">Hệ thống</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đính kèm (tùy chọn)
              </label>

              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <FaUpload className="text-gray-500" />
                    <span className="text-sm">Chọn ảnh</span>
                  </button>
                  {/* <span className="text-xs text-gray-500">
                    JPG, PNG (max 5MB)
                  </span> */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSend}
              disabled={uploading || !form.title.trim() || !form.message.trim()}
              className={`w-full py-2 px-4 rounded font-medium text-white transition-all flex items-center justify-center gap-2 ${
                uploading || !form.title.trim() || !form.message.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang upload...
                </>
              ) : (
                <>
                  {/* <FaPaperPlane /> */}
                  Gửi thông báo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
