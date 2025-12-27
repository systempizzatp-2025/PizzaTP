import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const CancelOrderModal = ({ orderId, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [customReason, setCustomReason] = useState("");

  const cancelReasons = [
    "Đổi ý, không muốn mua nữa",
    "Đặt nhầm sản phẩm/số lượng",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Địa chỉ giao hàng thay đổi",
    "Không liên hệ được với người bán",
    "Lý do khác",
  ];

  const handleSubmit = async () => {
    let finalReason = reason;

    if (reason === "Lý do khác") {
      if (!customReason.trim()) {
        toast.error("Vui lòng nhập lý do hủy đơn");
        return;
      }
      finalReason = customReason;
    }

    if (!finalReason.trim()) {
      toast.error("Vui lòng chọn lý do hủy đơn");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(finalReason);
    } catch (error) {
      console.error("Error in modal submit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReasonSelect = (selectedReason) => {
    setReason(selectedReason);
    if (selectedReason !== "Lý do khác") {
      setCustomReason("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 overflow-y-auto scrollBarCustom max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Hủy đơn hàng</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Mã đơn:</span>
              <span className="ml-2 font-semibold text-red-600">{orderId}</span>
            </p>
            <p className="text-gray-600">Vui lòng chọn lý do hủy đơn:</p>
          </div>

          <div className="space-y-2 mb-6">
            {cancelReasons.map((item, index) => (
              <label
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                  reason === item
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={item}
                  checked={reason === item}
                  onChange={() => handleReasonSelect(item)}
                  className="mr-3 text-red-500 focus:ring-red-500"
                  disabled={loading}
                />
                <span className="text-gray-700">{item}</span>
              </label>
            ))}
          </div>

          {reason === "Lý do khác" && (
            <div className="mb-6">
              <textarea
                placeholder="Vui lòng nhập lý do cụ thể..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                rows="3"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập ít nhất 10 ký tự
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={
                !reason.trim() ||
                (reason === "Lý do khác" && !customReason.trim()) ||
                loading
              }
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận hủy"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
