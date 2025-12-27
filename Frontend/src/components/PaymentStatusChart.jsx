import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Axios from "../utils/AxiosAdmin";
import { ChevronDown } from "react-feather";

const PaymentStatusChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentStats = async () => {
      setLoading(true);
      try {
        const res = await Axios.get("/api/dashboard/payment/stats", { 
          params: { period: selectedPeriod },
        });
        if (res.data && Array.isArray(res.data.data)) {
          setOrderStatusData(res.data.data);
        } else {
          setOrderStatusData([]);
        }
      } catch (err) {
        console.error("Lỗi fetch payment stats:", err);
        setOrderStatusData([]);
      }
      setLoading(false);
    };
    fetchPaymentStats();
  }, [selectedPeriod]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">
          Trạng thái thanh toán
        </h3>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none px-3 py-1.5 pr-6 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="thisMonth">Tháng này</option>
            <option value="lastMonth">Tháng trước</option>
          </select>
          <ChevronDown className="absolute right-1.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-20">Đang tải dữ liệu...</div>
      ) : orderStatusData.length === 0 ? (
        <div className="text-center text-gray-500 py-20">Không có dữ liệu trong tháng này</div>
      ) : (
        <>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {orderStatusData.map((status, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
              >
                <div className="text-lg">{status.icon}</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-800">
                    {status.status}
                  </div>
                  <div
                    className="text-sm font-bold"
                    style={{ color: status.color }}
                  >
                    {status.value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentStatusChart;
