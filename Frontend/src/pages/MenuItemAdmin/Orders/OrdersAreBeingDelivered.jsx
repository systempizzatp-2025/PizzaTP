import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdPerson,
  MdPhone,
  MdLocationPin,
  MdDirectionsBike,
  MdCall,
  MdMessage,
  MdMap,
  MdRefresh,
} from "react-icons/md";
import AxiosAdmin from "../../../utils/AxiosAdmin";
import { DisplayPriceInVND } from "../../../utils/DisplayPriceInVND";
import toast from "react-hot-toast";

const OrdersAreBeingDelivered = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await AxiosAdmin({
        url: "/api/v1/quan-tri-vien/don-dang-giao",
        method: "get",
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn đang giao:", error);
    } finally {
      setLoading(false);
    }
  };

  const callShipper = (phone) => {
    window.open(`tel:${phone}`, "_blank");
  };

  const messageShipper = (phone) => {
    window.open(`sms:${phone}`, "_blank");
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }
  console.log(orders);
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng đang giao
          </h1>
          <p className="text-gray-600 mt-1">Theo dõi trực tuyến đơn hàng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
          >
            <MdRefresh className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
  w-full
  pl-10 pr-4 py-2
  border border-gray-300 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition-all
"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600">Đang giao</p>
          <p className="text-2xl font-bold text-blue-700">
            {filteredOrders.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">Shipper đang làm</p>
          <p className="text-2xl font-bold text-green-700">
            {new Set(filteredOrders.map((o) => o.shipperName)).size}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-600">Tổng giá trị</p>
          <p className="text-2xl font-bold text-orange-700">
            {DisplayPriceInVND(
              filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            )}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDirectionsBike className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-500">Không có đơn hàng đang giao</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {order.orderId}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded font-medium">
                    Đang giao
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">
                    {DisplayPriceInVND(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Khách hàng</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MdPerson className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MdPhone className="w-4 h-4 text-gray-500" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MdLocationPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{order.customerAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Shipper</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MdDirectionsBike className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium">{order.shipperName}</p>
                        <p className="text-sm text-gray-600">
                          {order.shipperPhone}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <MdPhone className="w-4 h-4 text-gray-500" />
                        <span>{order.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => callShipper(order.shipperPhone)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <MdCall className="w-4 h-4" />
                    Gọi shipper
                  </button>
                  <button
                    onClick={() => messageShipper(order.shipperPhone)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <MdMessage className="w-4 h-4" />
                    Nhắn tin
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersAreBeingDelivered;
