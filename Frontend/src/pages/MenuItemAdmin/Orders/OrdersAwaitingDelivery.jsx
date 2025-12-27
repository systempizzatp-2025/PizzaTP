import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdPerson,
  MdPhone,
  MdLocationPin,
  MdAccessTime,
  MdAssignment,
  MdCancel,
  MdRefresh,
} from "react-icons/md";
import AxiosAdmin from "../../../utils/AxiosAdmin";
import { DisplayPriceInVND } from "../../../utils/DisplayPriceInVND";
import toast from "react-hot-toast";

const OrdersAwaitingDelivery = () => {
  const [orders, setOrders] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShipper, setSelectedShipper] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchShippers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await AxiosAdmin({
        url: "/api/v1/quan-tri-vien/don-cho-giao",
        method: "get",
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn chờ giao:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchShippers = async () => {
    try {
      const response = await AxiosAdmin({
        url: "/api/v1/quan-tri-vien/shippers",
        method: "get",
      });

      if (response.data.success) {
        setShippers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách shipper:", error);
    }
  };

  const assignShipper = async (orderId) => {
    const shipperId = selectedShipper[orderId];
    if (!shipperId) {
      toast.error("Vui lòng chọn shipper");
      return;
    }

    try {
      const response = await AxiosAdmin({
        url: `/api/v1/quan-tri-vien/phan-cong-shipper/${orderId}`,
        method: "post",
        data: { shipperId },
      });

      if (response.data.success) {
        toast.success("Đã phân công shipper thành công");
        fetchOrders();
        setSelectedShipper((prev) => ({ ...prev, [orderId]: "" }));
      }
    } catch (error) {
      toast.error("Không thể phân công shipper");
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const response = await AxiosAdmin({
        url: `/api/v1/quan-tri-vien/huy-don-hang/${orderId}`,
        method: "post",
      });

      if (response.data.success) {
        toast.success("Đã hủy đơn hàng thành công");
        fetchOrders();
      }
    } catch (error) {
      toast.error("Không thể hủy đơn hàng");
    }
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Đơn hàng chờ giao
          </h1>
          <p className="text-gray-600 mt-1">Quản lý và phân công đơn hàng</p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
        >
          <MdRefresh className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 pl-10 py-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Tổng: <span className="font-bold">{filteredOrders.length}</span> đơn
          hàng
        </p>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Không có đơn hàng chờ giao</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {order.orderId}
                  </h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded font-medium">
                    Chờ giao
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">
                    {DisplayPriceInVND(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
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

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <MdAccessTime className="w-4 h-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span>{order.branchName}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <select
                      value={selectedShipper[order.orderId] || ""}
                      onChange={(e) =>
                        setSelectedShipper({
                          ...selectedShipper,
                          [order.orderId]: e.target.value,
                        })
                      }
                      className="w-full px-2 py-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
                    >
                      <option value="">Chọn nhân viên...</option>
                      {shippers.map((shipper) => (
                        <option key={shipper._id} value={shipper._id}>
                          {shipper.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => assignShipper(order.orderId)}
                      disabled={!selectedShipper[order.orderId]}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdAssignment className="w-4 h-4" />
                      Phân công
                    </button>
                    <button
                      onClick={() => cancelOrder(order.orderId)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2"
                    >
                      <MdCancel className="w-4 h-4" />
                      Hủy đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersAwaitingDelivery;
