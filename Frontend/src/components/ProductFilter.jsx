import React, { useState } from "react";
import { Filter, Search, ChevronDown } from "lucide-react";

const ProductFilter = ({
  onSearch,
  onPriceRange,
  onTypeChange,
  onSortChange,
  types = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceOptions = [
    { id: "all", label: "Tất cả giá", value: "" },
    { id: "under100k", label: "Dưới 100K", value: "0-100000" },
    { id: "100k-500k", label: "100K - 500K", value: "100000-500000" },
    { id: "500k-1m", label: "500K - 1Tr", value: "500000-1000000" },
    { id: "over1m", label: "Trên 1Tr", value: "1000000-" },
  ];

  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "priceLow", label: "Giá thấp → cao" },
    { value: "priceHigh", label: "Giá cao → thấp" },
    { value: "newest", label: "Mới nhất" },
    { value: "popular", label: "Phổ biến" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

      <div
        className="md:hidden flex items-center justify-between p-4 border-b cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-gray-800">Bộ lọc sản phẩm</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>

      <div className={`${isExpanded ? "block" : "hidden"} md:block`}>
        <div className="p-4 md:p-5 space-y-5">
        
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>


          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Khoảng giá
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {priceOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    const [min, max] = option.value.split("-");
                    onPriceRange({
                      min: min || "",
                      max: max || "",
                    });
                  }}
                  className="py-2 px-3 text-xs bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 hover:border-orange-300 rounded-lg transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

        
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Loại sản phẩm
            </h4>
            <div className="relative">
              <select
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none cursor-pointer"
              >
                <option value="">Tất cả loại</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

       
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Sắp xếp
            </h4>
            <div className="relative">
              <select
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none appearance-none cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
