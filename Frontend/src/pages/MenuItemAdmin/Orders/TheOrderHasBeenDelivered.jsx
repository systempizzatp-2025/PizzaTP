import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdPerson,
  MdPhone,
  MdLocationPin,
  MdCheckCircle,
  MdDownload,
  MdPrint,
  MdFilterList,
  MdCalendarToday,
  MdRefresh,
} from "react-icons/md";
import AxiosAdmin from "../../../utils/AxiosAdmin";
import { DisplayPriceInVND } from "../../../utils/DisplayPriceInVND";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TheOrderHasBeenDelivered = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageDeliveryTime: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [orders, searchTerm, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await AxiosAdmin({
        url: "/api/v1/quan-tri-vien/don-da-giao",
        method: "get",
      });

      if (response.data.success) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn đã giao:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.deliveredAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    setFilteredOrders(filtered);
  };

  const calculateStats = () => {
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = filteredOrders.length;
    const avgDeliveryTime =
      filteredOrders.length > 0
        ? filteredOrders.reduce((sum, order) => sum + order.deliveryTime, 0) /
          filteredOrders.length
        : 0;

    setStats({
      totalRevenue,
      totalOrders,
      averageDeliveryTime: Math.round(avgDeliveryTime),
    });
  };

  const exportToCSV = () => {
    const headers = [
      "Mã đơn",
      "Khách hàng",
      "SĐT",
      "Địa chỉ",
      "Shipper",
      "Ngày đặt",
      "Ngày giao",
      "Thời gian giao (phút)",
      "Tổng tiền",
      "Phương thức TT",
    ];

    const csvData = filteredOrders.map((order) => [
      order.orderId,
      order.customerName,
      order.customerPhone,
      order.customerAddress,
      order.shipperName,
      new Date(order.createdAt).toLocaleDateString("vi-VN"),
      new Date(order.deliveredAt).toLocaleDateString("vi-VN"),
      order.deliveryTime,
      order.totalAmount,
      order.paymentMethod,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `don-da-giao-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Đã xuất file CSV");
  };

  const printReport = () => {
    window.print();
    toast.success("Đang in báo cáo...");
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng đã giao</h1>
          <p className="text-gray-600 mt-1">Lịch sử và thống kê đơn hàng</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">Tổng đơn đã giao</p>
          <p className="text-2xl font-bold text-green-700">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600">Tổng doanh thu</p>
          <p className="text-2xl font-bold text-blue-700">
            {DisplayPriceInVND(stats.totalRevenue)}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
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

        <div className="relative">
          <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            placeholderText="Chọn khoảng ngày"
            className="
  w-full
  pl-10 pr-4 py-2
  border border-gray-300 rounded-lg
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition-all
"
            dateFormat="dd/MM/yyyy"
            isClearable={true}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
        >
          <MdDownload className="w-4 h-4" />
          Xuất CSV
        </button>
        <button
          onClick={printReport}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
        >
          <MdPrint className="w-4 h-4" />
          In báo cáo
        </button>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          Tổng: <span className="font-bold">{filteredOrders.length}</span> đơn
          đã giao
        </p>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdCheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-500">Không có đơn hàng đã giao</p>
            {(searchTerm || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setDateRange([null, null]);
                }}
                className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              >
                Xóa bộ lọc
              </button>
            )}
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
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded font-medium">
                    Đã giao
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-600">
                    {DisplayPriceInVND(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Khách hàng</h4>
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

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">
                    Thông tin giao hàng
                  </h4>
                  <div className="flex items-center gap-2">
                    <MdCheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="font-medium">
                        Shipper: {order.shipperName}
                      </p>
                    </div>
                  </div>
                  <div className="gap-2">
                    <p className="text-sm text-gray-600">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày giao:{" "}
                      {new Date(order.deliveredAt).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      Số điện thoại:{" "}
                      <span className="font-bold">{order.customerPhone}</span>
                    </p>
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

export default TheOrderHasBeenDelivered;
