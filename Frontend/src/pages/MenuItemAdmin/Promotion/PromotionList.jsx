import React, { useEffect, useState } from "react";
import Axios from "../../../utils/AxiosAdmin";
import {
  MdEdit,
  MdDelete,
  MdLocalOffer,
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";

const PromotionList = ({ isAdmin = false }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await Axios.get("/api/v1/promotion/list");
      if (res.data.success) {
        setPromotions(res.data.promos);
      } else {
        setError("Không tải được danh sách khuyến mãi");
      }
    } catch (err) {
      setError("Không tải được danh sách khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa mã này?")) return;
    try {
      await Axios.delete(`/api/v1/promotion/delete/${id}`);
      toast.success("Xóa thành công!");
      fetchPromotions();
    } catch (err) {
      toast.error("Xóa thất bại!");
    }
  };

  const handleEdit = (promo) => {
    toast("Chức năng sửa đang phát triển", { icon: "ℹ️" });
  };

  const getStatus = (promo) => {
    const now = new Date();
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);

    if (!promo.isActive)
      return { text: "Đã tắt", color: "bg-gray-100 text-gray-600" };
    if (now < startDate)
      return { text: "Sắp diễn ra", color: "bg-blue-100 text-blue-600" };
    if (now > endDate)
      return { text: "Đã hết hạn", color: "bg-red-100 text-red-600" };
    return { text: "Đang áp dụng", color: "bg-green-100 text-green-600" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">{error}</p>
        <button
          onClick={fetchPromotions}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mã Khuyến Mãi</h2>
        <div className="text-sm text-gray-500">
          {promotions.length} mã khuyến mãi
        </div>
      </div>


      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promo) => {
          const status = getStatus(promo);
          const isPercent = promo.discountType === "Percent";

          return (
            <div
              key={promo._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
            >
       
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MdLocalOffer className="w-5 h-5" />
                      <h3 className="font-bold text-lg tracking-wide">
                        {promo.code}
                      </h3>
                    </div>
                    <p className="text-red-100 text-sm opacity-90">
                      {promo.description}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

     
              <div className="p-4 space-y-3">
         
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Giá trị:</span>
                  <div className="flex items-center gap-1">
                    {isPercent ? (
                      <span className="text-2xl font-bold text-green-600">
                        -{promo.discountValue}%
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-green-600">
                        -{formatCurrency(promo.discountValue)}
                      </span>
                    )}
                  </div>
                </div>

         
                {promo.minOrderAmount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiShoppingCart className="w-4 h-4" />
                    <span>
                      Đơn tối thiểu: {formatCurrency(promo.minOrderAmount)}
                    </span>
                  </div>
                )}

          
                {promo.maxDiscount > 0 && isPercent && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdAttachMoney className="w-4 h-4" />
                    <span>
                      Giảm tối đa: {formatCurrency(promo.maxDiscount)}
                    </span>
                  </div>
                )}

           
                <div className="flex items-center gap-4 text-sm">
                  {promo.usageLimit > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiUsers className="w-4 h-4" />
                      <span>SL: {promo.usageLimit}</span>
                    </div>
                  )}
                  {promo.perUserLimit > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <span>• User: {promo.perUserLimit}</span>
                    </div>
                  )}
                </div>

            
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdCalendarToday className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Từ:</span>
                      <span>
                        {new Date(promo.startDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Đến:</span>
                      <span>
                        {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

    
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.text}
                  </span>
                  <div className="text-xs text-gray-500">
                    Đã dùng: {promo.usedCount || 0}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>


      {promotions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <MdLocalOffer className="w-full h-full" />
          </div>
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Chưa có mã khuyến mãi
          </h3>
          <p className="text-gray-400">Các mã khuyến mãi sẽ xuất hiện ở đây</p>
        </div>
      )}
    </div>
  );
};

export default PromotionList;
