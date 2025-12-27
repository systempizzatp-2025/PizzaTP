import React, { useEffect, useState } from "react";
import Axios from "../utils/AxiosAdmin";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const TopProductChart = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTop = async () => {
      setLoading(true);
      try {
        const res = await Axios.get("/api/dashboard/top-products");
        if (res.data?.data) setTopProducts(res.data.data);
      } catch (err) {
        console.error("Lỗi load top products", err);
      }
      setLoading(false);
    };

    fetchTop();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
        Top sản phẩm bán chạy
      </h3>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Đang tải...</div>
      ) : (
        <>
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {topProducts.map((item, index) => (
                    <Cell
                      key={index}
                      fill={item.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Tỷ lệ"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 text-ellipsis line-clamp-1">
                  <img
                    src={product.image}
                    className="w-8 h-full rounded-md object-cover"
                    alt={product.name}
                  />
                  <span className="text-sm font-medium text-gray-800 ">
                    {product.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-14 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${product.value}%`,
                        backgroundColor: product.color,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">
                    {product.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TopProductChart;
