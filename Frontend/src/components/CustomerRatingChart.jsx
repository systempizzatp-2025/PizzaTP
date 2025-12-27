import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Axios from "../utils/AxiosAdmin";

const CustomerRatingChart = () => {
  const [customerRatings, setCustomerRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const res = await Axios.get("/api/dashboard/rating/stats");

        if (res.data?.data) {
          setCustomerRatings(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi fetch rating stats:", err);
      }
      setLoading(false);
    };

    fetchRatings();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
        Đánh giá khách hàng
      </h3>

      {loading ? (
        <div className="text-center text-gray-500 py-16">
          Đang tải dữ liệu...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={customerRatings} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f3f4f6"
              horizontal={false}
            />
            <XAxis
              type="number"
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="rating"
              type="category"
              stroke="#6b7280"
              style={{ fontSize: "11px" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value} sao`}
            />
            <Tooltip formatter={(value) => [`${value} đánh giá`, "Số lượng"]} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {customerRatings.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CustomerRatingChart;
