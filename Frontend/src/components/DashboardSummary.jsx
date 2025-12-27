import React, { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Pizza,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Axios from "../utils/AxiosAdmin";

const DashboardSummary = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await Axios.get("/api/dashboard/stats/summary");
        if (res.data?.data) setStats(res.data.data);
      } catch (err) {
        console.error("Lỗi fetch summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 animate-pulse"
          >
            <div className="h-8 bg-gray-200 rounded mb-3"></div>
            <div className="h-5 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      icon: DollarSign,
      value: formatCurrency(stats.revenueToday),
      label: "Doanh thu hôm nay",
      trend: "+0%",
      up: true,
      color: "from-emerald-400 to-cyan-500",
    },
    {
      icon: ShoppingBag,
      value: stats.newOrdersToday,
      label: "Đơn hàng mới",
      trend: "+0%",
      up: true,
      color: "from-orange-400 to-pink-500",
    },
    {
      icon: Users,
      value: stats.newUsersToday,
      label: "Khách hàng mới",
      trend: "+0%",
      up: true,
      color: "from-blue-400 to-purple-500",
    },
    {
      icon: Pizza,
      value: stats.totalProducts,
      label: "Tổng sản phẩm",
      trend: "+0%",
      up: true,
      color: "from-purple-400 to-indigo-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
            >
              <stat.icon className="text-white w-4 h-4" />
            </div>
            <div
              className={`flex items-center gap-0.5 ${
                stat.up ? "text-green-500" : "text-red-500"
              }`}
            >
              {stat.up ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-semibold">{stat.trend}</span>
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-gray-800 mb-0.5">
            {stat.value}
          </p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

function formatCurrency(num) {
  return num.toLocaleString("vi-VN") + " ₫";
}

export default DashboardSummary;
