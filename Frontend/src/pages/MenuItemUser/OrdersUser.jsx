import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGlobalContext } from "../../provider/GlobalProvider";
import NoData from "../../components/NoData";
import { useNavigate } from "react-router-dom";
import valideURLConvert from "../../utils/valideURLConvert";
import Loading from "../../components/Loading";

import {
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBoxOpen,
  FaStore,
  FaRedo,
} from "react-icons/fa";
import CancelOrderModal from "../../components/CancelOrderModal";
import { removeOrder, setCancelLoading } from "../../store/orderSlice";
import toast from "react-hot-toast";
import Axios from "../../utils/AxiosUser";
import RatingModal from "./RatingModal";
import { DisplayPriceInVND } from "../../utils/DisplayPriceInVND";

const OrdersUser = () => {
  const orders = useSelector((state) => state?.orders?.order || []);
  const cancelLoading = useSelector(
    (state) => state?.orders?.cancelLoading || false
  );

  const dispatch = useDispatch();
  const { fetchOrder } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [reviewedProducts, setReviewedProducts] = useState([]);

  const handleOpenRating = (product) => {
    setSelectedProduct(product);
    setShowRatingModal(true);
  };

  const handleRatingSuccess = (productId) => {
    setReviewedProducts((prev) => [...prev, productId]);
    setShowRatingModal(false);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        await fetchOrder();
      } catch (error) {
        toast.error("Lỗi khi tải đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [fetchOrder]);


  useEffect(() => {
    if (orders && orders.length > 0) {
     
      const filteredOrders = orders.filter(
        (order) =>
          order.order_status === "delivered" || order.payment_status === "paid"
      );

      const grouped = filteredOrders.reduce((acc, order) => {
        if (!order) return acc;

        const orderId = order.orderId || order._id;

        if (!acc[orderId]) {
          acc[orderId] = {
            orderId,
            createdAt: order.createdAt || new Date().toISOString(),
            totalAmt: 0,
            payment_status: order.payment_status || "unknown",
            order_status: order.order_status || "pending",
            seller: order.seller || {},
            products: [],
            address: order.delivery_address || {},
            deliveredAt: order.deliveredAt || order.updatedAt,
          };
        }

        const itemQuantity = order.quantity || 1;
        const itemTotal = order.totalAmt || order.subTotalAmt || 0;

        acc[orderId].totalAmt += itemTotal;

        acc[orderId].products.push({
          ...order,
          itemTotal,
          quantity: itemQuantity,
        });

        return acc;
      }, {});

      setGroupedOrders(grouped);
    } else {
      setGroupedOrders({});
    }
  }, [orders]);

  const getOrderStatusInfo = (status) => {
    const statusLower = (status || "pending")?.toLowerCase();

    switch (statusLower) {
      case "delivered":
      case "completed":
        return {
          text: "Đã giao hàng",
          icon: <FaCheckCircle className="text-green-500" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          badgeColor: "bg-green-100 text-green-700",
        };
      case "shipping":
      case "delivering":
        return {
          text: "Đang giao hàng",
          icon: <FaTruck className="text-blue-500" />,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          badgeColor: "bg-blue-100 text-blue-700",
        };
      case "pending":
      case "processing":
        return {
          text: "Đang xử lý",
          icon: <FaClock className="text-yellow-500" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          badgeColor: "bg-yellow-100 text-yellow-700",
        };
      case "cancelled":
      case "failed":
        return {
          text: "Đã hủy",
          icon: <FaTimesCircle className="text-red-500" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          badgeColor: "bg-red-100 text-red-700",
        };
      default:
        return {
          text: "Chờ xác nhận",
          icon: <FaBoxOpen className="text-gray-500" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          badgeColor: "bg-gray-100 text-gray-700",
        };
    }
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    if (!selectedOrderId || !reason) {
      toast.error("Thiếu thông tin để hủy đơn");
      return;
    }

    try {
      dispatch(setCancelLoading(true));

      const response = await Axios({
        url: "api/v1/dat-hang/huy-don",
        method: "post",
        data: { orderId: selectedOrderId, reason },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Đã hủy đơn hàng");
        dispatch(removeOrder(selectedOrderId));
        await fetchOrder();
      } else {
        toast.error(response.data.message || "Hủy đơn thất bại");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi hủy đơn");
    } finally {
      dispatch(setCancelLoading(false));
      setShowCancelModal(false);
      setSelectedOrderId(null);
    }
  };

  if (loading) return <Loading />;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Đơn hàng của tôi
            </h1>
          </div>
          <NoData
            message="Bạn chưa có đơn hàng nào"
            subMessage="Hãy mua sắm và quay lại xem đơn hàng của bạn tại đây"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Đơn hàng của tôi
          </h1>
          <p className="text-gray-600 mt-2">
            Tổng cộng:{" "}
            <span className="font-semibold text-red-500">
              {Object.keys(groupedOrders).length}
            </span>{" "}
            đơn hàng
          </p>
        </div>


        <button
          onClick={async () => {
            try {
              setLoading(true);
              await fetchOrder();
              toast.success("Đã làm mới danh sách đơn hàng");
            } catch (error) {
              toast.error("Lỗi khi làm mới");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaRedo className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="font-medium">Làm mới</span>
        </button>

        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-180px)] scrollBarCustom mt-4">
          {Object.values(groupedOrders).map((orderGroup, index) => {
            const statusInfo = getOrderStatusInfo(orderGroup.order_status);

            const totalQuantity = orderGroup.products.reduce((sum, product) => {
              return sum + (product.quantity || 1);
            }, 0);

            const completedStatuses = [
              "delivered",
              "completed",
              "cancelled",
              "failed",
              "shipping",
              "delivering",
            ];
            const isCompleted = completedStatuses.includes(
              orderGroup.order_status?.toLowerCase()
            );
            const isCashOnDelivery =
              orderGroup.payment_status === "CASH ON DELIVERY";
            const canCancel = !isCompleted && isCashOnDelivery;

            return (
              <div
                key={`${orderGroup.orderId}-${index}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                <div
                  className={`p-4 border-b ${statusInfo.borderColor} ${statusInfo.bgColor}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                     
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* <span className={`font-semibold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span> */}
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.badgeColor}`}
                          >
                            {totalQuantity} sản phẩm
                          </span>

                          {orderGroup.payment_status === "paid" && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Đã thanh toán
                            </span>
                          )}
                          {orderGroup.payment_status === "CASH ON DELIVERY" && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              Thanh toán khi nhận
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Mã đơn:</span>
                          <span className="ml-1 text-gray-700">
                            {orderGroup.orderId}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {new Date(orderGroup.createdAt).toLocaleDateString(
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
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <FaStore className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {orderGroup.seller?.name || "Cửa hàng"}
                    </span>
                    {orderGroup.seller?.rating && (
                      <span className="ml-2 text-sm text-gray-500">
                        ⭐ {orderGroup.seller.rating}
                      </span>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {orderGroup.products.map((product, idx) => {
                    const sizeInfo =
                      product.sizes?.[0] ||
                      (product.size
                        ? { name: product.size, price: product.sizePrice || 0 }
                        : null);
                    const baseInfo =
                      product.bases?.[0] ||
                      (product.base
                        ? { name: product.base, price: product.basePrice || 0 }
                        : null);

                    const pricePerItem =
                      (product.product_details?.price || 0) +
                      (sizeInfo?.price || 0) +
                      (baseInfo?.price || 0);

                    const totalForProduct =
                      pricePerItem * (product.quantity || 1);

                    return (
                      <div
                        key={`${product._id || product.productId}-${idx}`}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/san-pham/${valideURLConvert(
                              product.product_details?.name || "product"
                            )}-${product.productId}`
                          )
                        }
                      >
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <img
                              src={
                                product.product_details?.image?.[0] ||
                                "https://via.placeholder.com/100"
                              }
                              alt={product.product_details?.name || "Sản phẩm"}
                              className="w-full h-full object-cover rounded-lg border border-gray-200"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium line-clamp-2 text-gray-800 hover:text-red-600 transition-colors">
                              {product.product_details?.name ||
                                "Sản phẩm không xác định"}
                            </h3>

                            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-700">
                            
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Số lượng:</span>
                                <span className="font-semibold text-red-600">
                                  {product.quantity || 1}
                                </span>
                              </div>

                         
                              {sizeInfo && sizeInfo.name && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Size:</span>
                                  <span>{sizeInfo.name}</span>

                                  {sizeInfo.price > 0 && (
                                    <span className="text-green-600 text-xs">
                                      (+{DisplayPriceInVND(sizeInfo.price)})
                                    </span>
                                  )}
                                </div>
                              )}

                         
                              {baseInfo && baseInfo.name && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Đế:</span>
                                  <span>{baseInfo.name}</span>

                                  {baseInfo.price > 0 && (
                                    <span className="text-green-600 text-xs">
                                      (+{DisplayPriceInVND(baseInfo.price)})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-2"> */}
                            {/* <span className="text-lg font-bold text-red-600">
                                  {DisplayPriceInVND(totalForProduct)}
                                </span> */}
                            {/* {product.product_details?.discount > 0 &&
                                  product.product_details?.price && (
                                    <span className="text-sm text-gray-400 line-through">
                                      {DisplayPriceInVND(
                                        product.product_details.price *
                                          (product.quantity || 1)
                                      )}
                                    </span>
                                  )} */}
                            {/* </div> */}
                            {/* <div className="text-sm text-gray-500">
                                {DisplayPriceInVND(pricePerItem)}/sản phẩm
                              </div> */}
                          </div>
                        </div>
                      </div>
                      // </div>
                    );
                  })}
                </div>

                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="text-left md:text-left">
                      <p className="text-sm text-gray-600">Tổng tiền:</p>
                      <p className="text-xl font-bold text-red-600">
                        {DisplayPriceInVND(orderGroup.totalAmt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(orderGroup.orderId)}
                          className="px-4 py-2 border border-red-300 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm"
                          disabled={cancelLoading}
                        >
                          {cancelLoading &&
                          selectedOrderId === orderGroup.orderId
                            ? "Đang hủy..."
                            : "Hủy đơn"}
                        </button>
                      )}

                      <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm">
                        Liên hệ người bán
                      </button>

                      {orderGroup.products.map((product, idx) => {
                        const isPaid =
                          orderGroup.payment_status === "paid" ||
                          orderGroup.payment_status === "CASH ON DELIVERY";

                        const hasReviewed = reviewedProducts.includes(
                          product.productId
                        );

                        // Chỉ hiển thị nút Đánh giá nếu đã thanh toán và chưa đánh giá
                        // if (!isPaid || hasReviewed) return null;

                        return (
                          <div
                            className="flex flex-wrap gap-2"
                            key={`${product._id || product.productId}-${idx}`}
                          >
                            <button
                              onClick={() => handleOpenRating(product)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
                            >
                              Đánh giá
                            </button>

                            <button
                              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/san-pham/${valideURLConvert(
                                    product.product_details?.name || "product"
                                  )}-${product.productId}`
                                );
                              }}
                            >
                              Mua lại
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showRatingModal && selectedProduct && (
        <RatingModal
          product={selectedProduct}
          onClose={() => setShowRatingModal(false)}
          setComments={setComments}
          onSuccess={() => handleRatingSuccess(selectedProduct.productId)}
        />
      )}

      {showCancelModal && (
        <CancelOrderModal
          orderId={selectedOrderId}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedOrderId(null);
          }}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
};

export default OrdersUser;
