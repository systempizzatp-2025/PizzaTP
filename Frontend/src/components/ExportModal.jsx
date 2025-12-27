import React, { useState } from "react";
import { FaFileExcel } from "react-icons/fa";
import { MdClose as MdCloseIcon } from "react-icons/md";
import axios from "../utils/AxiosAdmin";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const exportOptions = [
    {
      category: "Báo cáo biểu đồ",
      options: [
        { label: "Báo cáo doanh thu", value: "revenue_report" },
        { label: "Báo cáo số lượng đơn hàng", value: "orders_report" },
        { label: "Báo cáo sản phẩm", value: "products_report" },
        { label: "Báo cáo tổng quan", value: "overview_report" },
      ],
    },
  ];

  // Xuất báo cáo doanh thu
  const exportRevenueReport = async (month, year) => {
    try {
      setLoading(true);

      const today = new Date();
      month = month ?? today.getMonth() + 1;
      year = year ?? today.getFullYear();

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const res = await axios.get(
        `/api/report/revenue?startDate=${startStr}&endDate=${endStr}`
      );

      if (res.data.success) {
        const data = res.data.data;

        const formattedData = data.map((item) => ({
          Ngày: `${item._id.year}-${String(item._id.month).padStart(
            2,
            "0"
          )}-${String(item._id.day).padStart(2, "0")}`,
          "Tổng doanh thu": item.totalRevenue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Doanh thu ${month}-${year}`);

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `Revenue_Report_${month}_${year}.xlsx`);

        alert("Đã xuất báo cáo doanh thu thành công!");
      } else {
        alert("Lấy dữ liệu thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xuất báo cáo doanh thu");
    } finally {
      setLoading(false);
    }
  };

  // Xuất báo cáo số lượng đơn hàng
  const exportOrdersReport = async (month, year) => {
    try {
      setLoading(true);

      const today = new Date();
      month = month ?? today.getMonth() + 1;
      year = year ?? today.getFullYear();

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const startStr = startDate.toISOString().split("T")[0];
      const endStr = endDate.toISOString().split("T")[0];

      const res = await axios.get(
        `/api/report/orders?startDate=${startStr}&endDate=${endStr}`
      );

      if (res.data.success) {
        const data = res.data.data;

        const formattedData = data.map((item) => ({
          Ngày: `${item._id.year}-${String(item._id.month).padStart(
            2,
            "0"
          )}-${String(item._id.day).padStart(2, "0")}`,
          "Tổng đơn hàng": item.totalOrders,
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Đơn hàng ${month}-${year}`);

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `Orders_Report_${month}_${year}.xlsx`);

        alert("Đã xuất báo cáo số lượng đơn hàng thành công!");
      } else {
        alert("Lấy dữ liệu thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xuất báo cáo số lượng đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const exportProductsReport = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/report/products");

      if (res.data.success) {
        const data = res.data.data;

        const formattedData = data.map((item) => ({
          "Tên sản phẩm": item.name,
          Giá: item.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
          "Giảm giá": (item.discount / 100).toLocaleString("vi-VN", {
            style: "percent",
            minimumFractionDigits: 0, // hiển thị như 20% thay vì 20.0%
          }),
          "Mô tả": item.description,
          "Kích thước": item.sizes.join(", "),
          Loại: item.type,
          "Ngày tạo": new Date(item.createdAt).toLocaleDateString(),
        }));

        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sản phẩm");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, `Products_Report.xlsx`);

        alert("Đã xuất báo cáo sản phẩm thành công!");
      } else {
        alert("Lấy dữ liệu thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xuất báo cáo sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const exportOverviewReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/report/overview");
      if (!res.data.success) throw new Error("Lấy dữ liệu thất bại");

      const data = [
        { Chỉ_số: "Tổng đơn hàng", Giá_trị: res.data.data.totalOrders },
        {
          Chỉ_số: "Tổng doanh thu",
          Giá_trị: res.data.data.totalRevenue.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
        },
        { Chỉ_số: "Tổng sản phẩm", Giá_trị: res.data.data.totalProducts },
        { Chỉ_số: "Tổng đánh giá", Giá_trị: res.data.data.totalReviews },
        {
          Chỉ_số: "Tổng lượt yêu thích",
          Giá_trị: res.data.data.totalFavorites,
        },
        {
          Chỉ_số: "Khuyến mãi đang chạy",
          Giá_trị: res.data.data.activePromotions,
        },
      ];

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Tổng quan");

      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, `Overview_Report.xlsx`);

      alert("Đã xuất báo cáo tổng quan thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xuất báo cáo tổng quan");
    } finally {
      setLoading(false);
    }
  };

  const exportFunctions = {
    revenue_report: () => exportRevenueReport(),
    orders_report: () => exportOrdersReport(),
    products_report: () => exportProductsReport(),
    overview_report: () => exportOverviewReport(),
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 min-h-screen transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaFileExcel className="text-white text-xl sm:text-2xl" />
              <div>
                <h2 className="text-white font-bold text-base sm:text-xl">
                  Xuất dữ liệu ra Excel
                </h2>
                <p className="text-green-100 text-xs sm:text-sm mt-1">
                  Chọn loại dữ liệu bạn muốn xuất file
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 sm:p-2 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <MdCloseIcon className="text-white text-base sm:text-xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollBarCustom p-4 sm:p-6">
            {exportOptions.map((category, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base border-b border-gray-200 pb-1 sm:pb-2 mb-3">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.options.map((option, optionIdx) => (
                    <button
                      key={optionIdx}
                      onClick={exportFunctions[option.value]}
                      disabled={loading}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group active:scale-95"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg group-hover:bg-green-500 transition-all duration-200">
                        <FaFileExcel className="text-green-600 group-hover:text-white" />
                      </div>
                      <span className="text-gray-700 group-hover:text-green-700 font-medium text-sm break-words">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              File sẽ được tải xuống tự động
            </span>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 active:scale-95 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExportModal;
