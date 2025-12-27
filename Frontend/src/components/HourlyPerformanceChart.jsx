import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Axios from "../utils/AxiosAdmin";

const HourlyPerformanceChart = () => {
  const [hourlyPerformance, setHourlyPerformance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHourly = async () => {
      setLoading(true);
      try {
        const res = await Axios.get("/api/dashboard/hourly-performance");
        if (res.data?.data) {
          setHourlyPerformance(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi fetch hourly performance:", err);
      }
      setLoading(false);
    };

    fetchHourly();
  }, []);

  const formatRevenue = (value) => {
    const million = Number(value);

    if (Number.isNaN(million)) return "0";

    if (million < 1) {
      return `${Math.round(million * 1000)}K`;
    }

    return `${million.toFixed(1)}M`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
        Hiệu suất theo giờ
      </h3>

      {loading ? (
        <div className="text-center text-gray-500 py-16">
          Đang tải dữ liệu...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={hourlyPerformance}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              vertical={false}
            />

            <XAxis
              dataKey="hour"
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatRevenue}
            />

            <Tooltip
              formatter={(value, name) =>
                name === "Doanh thu"
                  ? [formatRevenue(value), "Doanh thu"]
                  : [value, "Số đơn"]
              }
            />

            <Bar
              dataKey="orders"
              fill="#4ECDC4"
              radius={[4, 4, 0, 0]}
              name="Số đơn"
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#FF6B6B"
              strokeWidth={2}
              name="Doanh thu"
              dot={{ fill: "#FF6B6B", r: 3 }}
              label={({ x, y, value }) => (
                <text
                  x={x}
                  y={y - 6}
                  fill="#FF6B6B"
                  fontSize={10}
                  textAnchor="middle"
                >
                  {formatRevenue(value)}
                </text>
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HourlyPerformanceChart;
