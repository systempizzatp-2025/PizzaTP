import React, { useState } from "react";
import Axios from "../../../utils/AxiosAdmin";
import summaryApi from "../../../common/SummaryApi";
import toast from "react-hot-toast";

const CreatePromotion = () => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "Percent",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    if (
      !formData.code ||
      !formData.description ||
      !formData.discountValue ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscount: Number(formData.maxDiscount) || 0,
        usageLimit: Number(formData.usageLimit) || 0,
        perUserLimit: Number(formData.perUserLimit) || 0,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      };

      const res = await Axios({
        ...summaryApi.create_promotion,
        data: payload,
      });

      if (res.data.success) {
        toast.success("Tạo mã khuyến mãi thành công!");

        setFormData({
          code: "",
          description: "",
          discountType: "Percent",
          discountValue: "",
          minOrderAmount: "",
          maxDiscount: "",
          usageLimit: "",
          perUserLimit: "",
          startDate: "",
          endDate: "",
          isActive: true,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Tạo mã thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tạo mã khuyến mãi mới</h2>

      <div className="bg-white border border-gray-300 rounded overflow-hidden">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã khuyến mãi *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder=""
                  maxLength={20}
                />
                <div className="absolute right-2 top-3 text-gray-400 text-xs">
                  {formData.code.length}/20
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả *
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giảm giá
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="Percent">Phần trăm (%)</option>
                <option value="Amount">Số tiền (VNĐ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị giảm *
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder={formData.discountType === "Percent"}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn tối thiểu
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giảm tối đa {formData.discountType === "Percent" && "(VNĐ)"}
              </label>
              <input
                type="number"
                name="maxDiscount"
                value={formData.maxDiscount}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
                disabled={formData.discountType === "Amount"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới hạn số lần dùng
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="*0 = không giới hạn"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới hạn mỗi user
              </label>
              <input
                type="number"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative inline-block w-10 h-5">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only"
                id="isActive"
              />
              <label
                htmlFor="isActive"
                className={`block w-10 h-5 rounded-full cursor-pointer transition-colors ${
                  formData.isActive ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.isActive ? "transform translate-x-5" : ""
                  }`}
                />
              </label>
            </div>
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Kích hoạt mã khuyến mãi ngay
            </label>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 px-4 rounded font-medium text-white transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tạo...
                </div>
              ) : (
                "Tạo mã khuyến mãi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePromotion;
