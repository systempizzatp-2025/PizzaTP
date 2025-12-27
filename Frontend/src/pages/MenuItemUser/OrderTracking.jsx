import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdStore,
  MdLocationPin,
  MdAccessTime,
  MdRestaurant,
  MdPhone,
  MdLocalShipping,
  MdCheckCircle,
  MdRefresh,
} from "react-icons/md";
import Axios from "../../utils/AxiosUser";
import toast from "react-hot-toast";
import CancelOrderModal from "../../components/CancelOrderModal";

const CANCELLED_STORAGE_KEY = "cancelled_orders_fe";

const OrderTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackingOrders, setTrackingOrders] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchTrackingOrders();
  }, []);

  const fetchTrackingOrders = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        url: "/api/v1/dat-hang/lay-danh-sach-don-da-dat-hang",
        method: "get",
      });

      if (response.data.success) {
        const grouped = await groupOrdersByOrderId(response.data.data);

        const cancelledOrders =
          JSON.parse(localStorage.getItem(CANCELLED_STORAGE_KEY)) || [];

        const cancelledIds = cancelledOrders.map((o) => o.orderId);

        const filteredOrders = Object.values(grouped).filter(
          (order) => !cancelledIds.includes(order.orderId)
        );

        setTrackingOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching tracking orders:", error);
      toast.error("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const groupOrdersByOrderId = async (orders) => {
    const grouped = {};

    for (const order of orders) {
      if (order.order_status === "delivered" || order.payment_status === "paid")
        continue;

      const orderId = order.orderId;

      if (!grouped[orderId]) {
        let addressInfo = {};

        if (
          order.delivery_address &&
          typeof order.delivery_address === "object"
        ) {
          addressInfo = {
            street: order.delivery_address.street || "",
            ward: order.delivery_address.ward || "",
            district: order.delivery_address.district || "",
            city: order.delivery_address.city || "",
            phoneNumber: order.delivery_address.phoneNumber || "",
            coordinates: order.delivery_address.coordinates || null,
          };
        } else if (typeof order.delivery_address === "string") {
          try {
            const addressResponse = await Axios({
              url: `/api/v1/dia-chi/chi-tiet-dia-chi/${order.delivery_address}`,
              method: "get",
            });

            if (addressResponse.data.success) {
              const a = addressResponse.data.data;
              addressInfo = {
                street: a.street || "",
                ward: a.ward || "",
                district: a.district || "",
                city: a.city || "",
                phoneNumber: a.phoneNumber || "",
                coordinates: a.coordinates || null,
              };
            }
          } catch {}
        }

        grouped[orderId] = {
          orderId,
          createdAt: order.createdAt,
          totalAmt: 0,
          payment_status: order.payment_status,
          status: order.order_status,
          products: [],
          address: addressInfo,
          shipper: order.shipper || null,
        };
      }

      grouped[orderId].products.push({
        _id: order._id,
        product_details: order.product_details,
        quantity: order.quantity,
        sizes: order.sizes || [],
        bases: order.bases || [],
        itemTotal: order.totalAmt || order.subtotalAmt || 0,
      });

      grouped[orderId].totalAmt += order.totalAmt || 0;
    }

    return grouped;
  };

  const handleCancelOrder = (order) => {
    if (canCancelOrder(order)) {
      setSelectedOrder(order);
      setSelectedOrderId(order.orderId);
      setShowCancelModal(true);
    } else {
      toast.error("Đơn hàng này không thể hủy");
    }
  };

  const confirmCancelOrder = (reason) => {
    setTrackingOrders((prev) =>
      prev.filter((order) => order.orderId !== selectedOrderId)
    );

    const cancelledOrders =
      JSON.parse(localStorage.getItem(CANCELLED_STORAGE_KEY)) || [];

    cancelledOrders.push({
      orderId: selectedOrderId,
      reason,
      cancelledAt: new Date().toISOString(),
    });

    localStorage.setItem(
      CANCELLED_STORAGE_KEY,
      JSON.stringify(cancelledOrders)
    );

    toast.success("Đã hủy đơn hàng thành công");

    setShowCancelModal(false);
    setSelectedOrderId(null);
    setSelectedOrder(null);
  };

  const canCancelOrder = (order) =>
    order.payment_status === "CASH ON DELIVERY" && order.status === "pending";

  const mapStatusToUser = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Đang chuẩn bị",
          color: "bg-yellow-100 text-yellow-800",
          description: "Đơn hàng đang được chuẩn bị",
        };
      case "shipping":
        return {
          text: "Đang giao hàng",
          color: "bg-blue-100 text-blue-800",
          description: "Shipper đang giao đến bạn",
        };
      case "delivered":
        return {
          text: "Đã giao hàng",
          color: "bg-green-100 text-green-800",
          description: "Đơn hàng đã được giao thành công",
        };
      default:
        return {
          text: "Đang xử lý",
          color: "bg-gray-100 text-gray-800",
          description: "Đơn hàng đang được xử lý",
        };
    }
  };

  const DisplayPriceInVND = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);

  const filteredOrders = trackingOrders.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAddressDisplay = (address) => {
    if (!address) return "Đang cập nhật địa chỉ...";
    return [address.street, address.ward, address.district, address.city]
      .filter(Boolean)
      .join(", ");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Theo dõi đơn hàng
              </h1>
              <p className="text-sm text-gray-500">
                Kiểm tra trạng thái đơn hàng của bạn
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm mã đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={fetchTrackingOrders}
                disabled={loading}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Làm mới danh sách"
              >
                <MdRefresh
                  className={`w-5 h-5 text-gray-700 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollBarCustom container mx-auto px-4 py-6 max-w-6xl">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdSearch className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng</p>
            <p className="text-gray-400 text-sm mt-1">
              Tất cả đơn hàng đã được giao hoặc bạn chưa có đơn hàng nào
            </p>
            <button
              onClick={fetchTrackingOrders}
              className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Tải lại
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = mapStatusToUser(order.status);
              const totalQuantity =
                order.products?.reduce(
                  (sum, product) => sum + (product.quantity || 0),
                  0
                ) || 0;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-bold text-gray-900">
                            {order.orderId}
                          </h2>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MdAccessTime className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <MdRestaurant className="w-4 h-4" />
                            {totalQuantity} sản phẩm
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {statusInfo.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng cộng:</p>
                        <p className="text-xl font-bold text-orange-600">
                          {DisplayPriceInVND(order.totalAmt)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.payment_status === "CASH ON DELIVERY"
                            ? "Thanh toán khi nhận hàng"
                            : "Đã thanh toán"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      <h4 className="font-medium text-gray-900">Sản phẩm</h4>
                      {order.products && order.products.length > 0 ? (
                        <div className="space-y-3">
                          {order.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="w-16 h-16 flex-shrink-0">
                                <img
                                  src={
                                    product.product_details?.image?.[0] ||
                                    "https://via.placeholder.com/100"
                                  }
                                  alt={
                                    product.product_details?.name || "Sản phẩm"
                                  }
                                  className="w-full h-full object-cover rounded border border-gray-200"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 text-sm">
                                  {product.product_details?.name || "Sản phẩm"}
                                </h3>
                                <div className="mt-1 text-xs text-gray-600 space-y-1">
                                  <p className="font-medium">
                                    Số lượng: {product.quantity}
                                  </p>
                                  {product.sizes &&
                                    product.sizes.length > 0 && (
                                      <p>
                                        Size: {product.sizes[0].name} (+
                                        {DisplayPriceInVND(
                                          product.sizes[0].price
                                        )}
                                        )
                                      </p>
                                    )}
                                  {product.bases &&
                                    product.bases.length > 0 && (
                                      <p>
                                        Đế: {product.bases[0].name} (+
                                        {DisplayPriceInVND(
                                          product.bases[0].price
                                        )}
                                        )
                                      </p>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-orange-600 mt-2">
                                  {DisplayPriceInVND(product.itemTotal)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          Không có thông tin sản phẩm
                        </p>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Thông tin giao hàng
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MdStore className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Lấy tại:
                            </p>
                            <p className="text-gray-600 text-sm">
                              Chi nhánh gần nhất
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MdLocationPin className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">
                              Giao đến:
                            </p>
                            <p className="text-gray-600 text-sm">
                              {getAddressDisplay(order.address)}
                            </p>
                            {order.address.phoneNumber && (
                              <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                                <MdPhone className="w-3 h-3" />
                                {order.address.phoneNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.status === "shipping" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-3">
                          <MdLocalShipping className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-800">
                              Shipper đang trên đường giao hàng
                            </p>
                            <p className="text-blue-600 text-sm">
                              Đơn hàng sẽ được giao trong thời gian sớm nhất
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {canCancelOrder(order) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleCancelOrder(order)}
                          className="w-full px-4 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                          <MdCheckCircle className="w-4 h-4" />
                          Hủy đơn hàng
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                          Chỉ có thể hủy đơn hàng thanh toán khi nhận hàng
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showCancelModal && (
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedOrderId(null);
            setSelectedOrder(null);
          }}
          onConfirm={confirmCancelOrder}
          orderId={selectedOrderId}
        />
      )}
    </div>
  );
};

export default OrderTracking;
