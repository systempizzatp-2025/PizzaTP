import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Axios from "../utils/AxiosAdmin";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 shadow rounded border text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, idx) => (
          <p key={idx} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomerAnalysisChart = () => {
  const [userDynamicsData, setUserDynamicsData] = useState([]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await Axios.get("/api/dashboard/reviews/stats");
        if (res.data && Array.isArray(res.data.data)) {
          setUserDynamicsData(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi fetch user stats:", err);
      }
    };
    fetchUserStats();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800">
            Phân tích khách hàng
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Số review, lượt like và khách hàng theo tuần
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={userDynamicsData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f3f4f6"
            vertical={false}
          />
          <XAxis
            dataKey="day"
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="reviewCount"
            stroke="#FF6B6B"
            strokeWidth={3}
            name="Số review"
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="interactiveUsers"
            stroke="#4ECDC4"
            strokeWidth={3}
            name="Khách hàng tương tác"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerAnalysisChart;
