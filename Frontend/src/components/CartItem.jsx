import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import { useGlobalContext } from "../provider/GlobalProvider";
import valideURLConvert from "../utils/valideURLConvert";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

const CartItem = () => {
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { updateCartItem, deleteCartItem } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteItemName, setDeleteItemName] = useState("");
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkDeleteCount, setBulkDeleteCount] = useState(0);

  useEffect(() => {
    setLoading(false);
    if (cartItem) {
      setSelectedItems(cartItem.map((item) => item._id));
      setSelectAll(true);
    }
  }, [cartItem]);

  useEffect(() => {
    if (cartItem && cartItem.length > 0) {
      setSelectAll(selectedItems.length === cartItem.length);
    }
  }, [selectedItems, cartItem]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(id, newQuantity);
  };

  const confirmRemoveItem = (id, name, e) => {
    e.stopPropagation();
    setDeleteItemId(id);
    setDeleteItemName(name);
    setShowDeleteModal(true);
  };

  const executeRemoveItem = () => {
    if (deleteItemId) {
      deleteCartItem(deleteItemId);
      setSelectedItems((prev) =>
        prev.filter((itemId) => itemId !== deleteItemId)
      );
    }
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteItemName("");
  };

  const confirmBulkDelete = () => {
    const toDeleteCount = cartItem.filter((item) =>
      selectedItems.includes(item._id)
    ).length;
    if (toDeleteCount === 0) return;
    setBulkDeleteCount(toDeleteCount);
    setShowBulkDeleteModal(true);
  };

  const executeBulkDelete = () => {
    const toDelete = cartItem.filter((item) =>
      selectedItems.includes(item._id)
    );
    toDelete.forEach((item) => deleteCartItem(item._id));
    setSelectedItems([]);
    setShowBulkDeleteModal(false);
    setBulkDeleteCount(0);
  };

  const handleSelectItem = (id, e) => {
    e.stopPropagation();
    if (selectedItems.includes(id)) {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems((prev) => [...prev, id]);
    }
  };

  const handleSelectAll = (e) => {
    e.stopPropagation();
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItem.map((item) => item._id));
    }
    setSelectAll(!selectAll);
  };

  const handlePaymentClick = (e) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }

    setIsProcessing(true);

    const selectedCartItems = cartItem.filter((item) =>
      selectedItems.includes(item._id)
    );



    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/thanh-toan", {
        state: {
          selectedItems: selectedItems,
        },
      });
    }, 200);
  };

  const calculateSelectedTotal = () => {
    if (!cartItem || selectedItems.length === 0) return 0;

    return cartItem.reduce((total, item) => {
      if (selectedItems.includes(item._id)) {
        const basePrice = pricewithDiscount(
          item?.productId?.price,
          item?.productId?.discount
        );
        const sizePrice = item?.sizePrice || 0;
        const baseExtra = item?.basePrice || 0;
        return total + (basePrice + sizePrice + baseExtra) * item.quantity;
      }
      return total;
    }, 0);
  };

  const getSelectedCount = () => selectedItems.length;

  const shippingFee = 0;
  const selectedTotal = calculateSelectedTotal();
  const finalTotal = selectedTotal + shippingFee;

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Xóa sản phẩm</h3>
            </div>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Bạn có muốn tiễn{" "}
              <span className="font-semibold text-red-500">
                "{deleteItemName}"
              </span>{" "}
              khỏi giỏ hàng?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Hành động này là một lần đi không trở lại!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={executeRemoveItem}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BulkDeleteModal = () => (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Xóa nhiều sản phẩm
              </h3>
            </div>
            <button
              onClick={() => setShowBulkDeleteModal(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Xóa{" "}
              <span className="font-bold text-red-500">{bulkDeleteCount}</span>{" "}
              món này khỏi giỏ hàng? Chúng sẽ buồn lắm đấy!
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkDeleteModal(false)}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={executeBulkDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {bulkDeleteCount} sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (!cartItem || cartItem.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy bắt đầu mua sắm!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="block">
              <button className="w-full sm:w-auto bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md">
                Mua sắm ngay
              </button>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg font-medium">Đang xử lý...</p>
          </div>
        </div>
      )}

      {showDeleteModal && <DeleteModal />}
      {showBulkDeleteModal && <BulkDeleteModal />}

      <div className={`pt-20 pb-16 ${isProcessing ? "opacity-50" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl pt-3 font-bold text-gray-900">
              Giỏ hàng của bạn ({cartItem.length} sản phẩm)
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSelectAll}
                      className={`flex items-center justify-center w-5 h-5 border rounded ${
                        selectAll
                          ? "bg-red-500 border-red-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectAll && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span
                      className="cursor-pointer font-medium text-gray-800"
                      onClick={handleSelectAll}
                    >
                      Chọn tất cả ({cartItem.length} sản phẩm)
                    </span>
                  </div>
                  <button
                    onClick={confirmBulkDelete}
                    disabled={selectedItems.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedItems.length > 0
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa ({selectedItems.length})
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollBarCustom">
                {cartItem.map((item) => {
                  const basePrice = pricewithDiscount(
                    item?.productId?.price,
                    item?.productId?.discount
                  );
                  const sizePrice = item?.sizePrice || 0;
                  const baseExtra = item?.basePrice || 0;
                  const finalItemPrice = basePrice + sizePrice + baseExtra;
                  const totalPrice = finalItemPrice * item.quantity;
                  const isSelected = selectedItems.includes(item._id);

                  return (
                    <div
                      key={item._id}
                      className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer ${
                        isSelected
                          ? "border-red-500 border-2"
                          : "border-gray-200"
                      }`}
                      onClick={() =>
                        navigate(
                          `/san-pham/${valideURLConvert(
                            item?.productId?.name
                          )}-${item?.productId?._id}`
                        )
                      }
                    >
                      <div className="p-3">
                        <div className="flex gap-3 items-start">
                          <div className="hidden sm:block">
                            <button
                              onClick={(e) => handleSelectItem(item._id, e)}
                              className={`flex items-center justify-center w-5 h-5 border rounded flex-shrink-0 ${
                                isSelected
                                  ? "bg-red-500 border-red-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </button>
                          </div>

                          <div className="w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
                            <img
                              src={item?.productId?.image?.[0]}
                              alt={item?.productId?.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-1">
                                  <div className="sm:hidden">
                                    <button
                                      onClick={(e) =>
                                        handleSelectItem(item._id, e)
                                      }
                                      className={`flex items-center justify-center w-4 h-4 border rounded flex-shrink-0 mt-0.5 ${
                                        isSelected
                                          ? "bg-red-500 border-red-500"
                                          : "border-gray-400"
                                      }`}
                                    >
                                      {isSelected && (
                                        <Check className="w-2 h-2 text-white" />
                                      )}
                                    </button>
                                  </div>

                                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900 line-clamp-1 hover:text-red-500 transition-colors flex-1 min-w-0">
                                    {item?.productId?.name}
                                  </h3>
                                </div>

                                <div className="text-xs text-gray-600 mb-2">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-medium text-gray-700">
                                      Loại:
                                    </span>
                                    <span className="truncate">
                                      {item?.productId?.type}
                                    </span>
                                    {item?.productId?.discount > 0 && (
                                      <>
                                        <span className="text-green-600 font-medium">
                                          -{item?.productId?.discount}%
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {item.size && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium text-gray-700">
                                        Size:
                                      </span>
                                      <span>{item.size}</span>
                                    </div>
                                  )}
                                  {item.base && (
                                    <div className="flex items-center gap-1">
                                      <span className="font-medium text-gray-700">
                                        Đế:
                                      </span>
                                      <span>{item.base}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(
                                          item._id,
                                          item.quantity - 1
                                        );
                                      }}
                                      className="p-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="px-2 font-semibold min-w-[2rem] text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(
                                          item._id,
                                          item.quantity + 1
                                        );
                                      }}
                                      className="p-1.5 hover:bg-gray-100 transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="text-right ml-3">
                                    <div className="flex flex-col items-end">
                                      {item?.productId?.discount > 0 && (
                                        <p className="text-xs text-gray-400 line-through">
                                          {DisplayPriceInVND(
                                            item?.productId?.price *
                                              item.quantity
                                          )}
                                        </p>
                                      )}
                                      <p className="text-base sm:text-xl font-bold text-red-500">
                                        {DisplayPriceInVND(totalPrice)}
                                      </p>
                                      <p className="text-xs text-gray-500 hidden sm:block">
                                        {DisplayPriceInVND(finalItemPrice)}/sp
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={(e) =>
                                  confirmRemoveItem(
                                    item._id,
                                    item?.productId?.name,
                                    e
                                  )
                                }
                                className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                                title="Xóa sản phẩm"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                  Tóm tắt đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sản phẩm đã chọn:</span>
                    <span className="font-semibold">
                      {getSelectedCount()} sản phẩm
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">
                      {DisplayPriceInVND(selectedTotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-semibold text-green-600">
                      {shippingFee === 0
                        ? "MIỄN PHÍ"
                        : DisplayPriceInVND(shippingFee)}
                    </span>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng tiền:</span>
                      <span className="text-2xl text-red-600">
                        {DisplayPriceInVND(finalTotal)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      (Đã bao gồm VAT nếu có)
                    </p>
                  </div>
                </div>

                {selectedItems.length === 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Vui lòng chọn ít nhất 1 sản phẩm để thanh toán
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePaymentClick}
                  disabled={isProcessing || selectedItems.length === 0}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition-all shadow-md mb-4 ${
                    selectedItems.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 hover:shadow-lg"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    `THANH TOÁN (${getSelectedCount()} sản phẩm)`
                  )}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .scrollBarCustom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollBarCustom::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .scrollBarCustom::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .scrollBarCustom::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        .fixed {
          backdrop-filter: blur(4px);
        }
      `}</style>
    </div>
  );
};

export default CartItem;
