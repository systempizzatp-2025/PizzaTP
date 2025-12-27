import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import { Grid3x3, List, Filter, X } from "lucide-react";

import CardProductAllCategoryPage from "./CardProductAllCategoryPage";
import ProductFilter from "./ProductFilter";
import NoData from "./NoData";
import { FaFaceSadCry } from "react-icons/fa6";

const CategoryAllProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilter, setShowFilter] = useState(false);

  const lastDashIndex = category?.lastIndexOf("-");
  const categoryId =
    lastDashIndex !== -1 ? category.slice(lastDashIndex + 1) : null;

  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [type, setType] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return setError("ID danh mục không hợp lệ.");

      setLoading(true);
      setError(null);

      try {
        const response = await Axios({
          ...SummaryApi.getProductByCategory,
          data: { id: categoryId },
        });
        if (response.data.success) setProducts(response.data.data || []);
        else setError("Không thể lấy sản phẩm.");
      } catch {
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (priceRange.min)
      result = result.filter((p) => p.price >= Number(priceRange.min));
    if (priceRange.max)
      result = result.filter((p) => p.price <= Number(priceRange.max));
    if (type) result = result.filter((p) => p.type === type);

    switch (sort) {
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popular":
        result.sort((a, b) => b.sold - a.sold);
        break;
    }

    return result;
  }, [products, search, priceRange, type, sort]);

  const activeFiltersCount = [
    search,
    priceRange.min,
    priceRange.max,
    type,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setPriceRange({ min: "", max: "" });
    setType("");
    setSort("default");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-gray-200 rounded-xl aspect-square"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <FaFaceSadCry className="text-5xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div
            className="absolute inset-0"
            onClick={() => setShowFilter(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl animate-slideInRight">
            <div className="p-4 h-full overflow-y-auto scrollBarCustom">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-800">Bộ lọc</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilter
                onSearch={setSearch}
                onPriceRange={setPriceRange}
                onTypeChange={setType}
                onSortChange={setSort}
                types={[...new Set(products.map((p) => p.type))]}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thực đơn</h1>
          {/* <p className="text-gray-600">
            {filteredProducts.length} sản phẩm
            {activeFiltersCount > 0 &&
              ` · ${activeFiltersCount} bộ lọc đang hoạt động`}
          </p> */}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-72 flex-shrink-0">
            <ProductFilter
              onSearch={setSearch}
              onPriceRange={setPriceRange}
              onTypeChange={setType}
              onSortChange={setSort}
              types={[...new Set(products.map((p) => p.type))]}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilter(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600"
                  >
                    <X className="w-4 h-4" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                    title="Xem dạng lưới"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                    title="Xem dạng danh sách"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Hiển thị {filteredProducts.length} sản phẩm
                </span>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <CardProductAllCategoryPage
                    key={product._id}
                    data={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <div>
                  <NoData />
                </div>

                {/* {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                  >
                    Xóa bộ lọc
                  </button>
                )} */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAllProductsPage;
