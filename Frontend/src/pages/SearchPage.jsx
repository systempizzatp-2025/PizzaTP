import React, { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import valideURLConvert from "../utils/valideURLConvert";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/AxiosUser";
import AxiosToastError from "../utils/AxiosToastError";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import NoData from "../components/NoData";
import Loading from "../components/Loading";

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("q") || "";
    setQuery(searchQuery);
  }, [location.search]);

  const fetchData = async (
    searchQuery = "",
    currentPage = 1,
    isNewSearch = false
  ) => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchQuery,
          page: currentPage,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (isNewSearch || currentPage === 1) {
          setData(responseData.data);
        } else {
          setData((prev) => [...prev, ...responseData.data]);
        }
        setTotalPage(responseData.totalPage);
        setHasMore(currentPage < responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchData(query, 1, true);

      if (query.trim()) {
        navigate(`/tim-kiem?q=${encodeURIComponent(query)}`, { replace: true });
      } else {
        navigate("/tim-kiem", { replace: true });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      fetchData(query, page, false);
    }
  }, [page]);

  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const clearInput = () => {
    setQuery("");
    setPage(1);
    setHasMore(true);
    navigate("/tim-kiem", { replace: true });
  };

  const handleClickCategory = (catName) => {
    const category = categoryData.find((c) => c.name === catName);
    if (!category) return;

    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === category._id)
    );
    if (!subcategory) return;

    const url = `/${valideURLConvert(category.name)}-${
      category._id
    }/${valideURLConvert(subcategory.name)}-${subcategory._id}`;

    navigate(url);
  };

  const handleFetchMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setPage(1);
      setHasMore(true);
      fetchData(query, 1, true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center px-4 transition-transform duration-300 ease-out opacity-100 scale-100 overflow-y-auto scrollBarCustom">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 p-2 hover:rotate-90 transition-transform z-10"
      >
        <X size={28} className="text-gray-700 dark:text-gray-200" />
      </button>

      <div className="w-full max-w-2xl mt-24 sm:mt-32 relative">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm pizza yêu thích của bạn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full text-xl sm:text-2xl border-b-2 border-gray-300 pb-2 pr-10 focus:outline-none focus:border-red-500 dark:bg-gray-900 dark:text-gray-100"
          />

          {query ? (
            <button
              onClick={clearInput}
              className="absolute right-8 top-0 p-1 hover:rotate-90 transition-transform"
              aria-label="Xóa nội dung"
            >
              <X size={24} className="text-gray-500 hover:text-red-500" />
            </button>
          ) : null}

          <button
            onClick={handleSearchSubmit}
            className="absolute right-0 top-0 p-1"
            aria-label="Tìm kiếm"
          >
            <Search size={24} className="text-red-500 hover:text-red-600" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-8 flex-1">
        {loading && data.length === 0 && <Loading />}
        {query && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Kết quả tìm kiếm cho: "{query}"
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tìm thấy {data.length} sản phẩm
            </p>
          </div>
        )}

        <InfiniteScroll
          dataLength={data.length}
          hasMore={hasMore}
          next={handleFetchMore}
          loader={
            loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                {loadingArrayCard.map((_, index) => (
                  <CardLoading key={"loadingsearchpage" + index} />
                ))}
              </div>
            )
          }
          endMessage={
            data.length > 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p>Đã hiển thị tất cả sản phẩm</p>
              </div>
            )
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data.map((p, index) => (
              <CardProduct data={p} key={p?._id + "searchProduct" + index} />
            ))}
          </div>
        </InfiniteScroll>

        {!loading && data.length === 0 && query && <NoData />}

        {!loading && data.length === 0 && !query && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Hãy nhập từ khóa để tìm kiếm sản phẩm
            </p>
          </div>
        )}
      </div>

      {/* Danh mục */}
      {/* <div className="w-full max-w-3xl mt-10 sm:mt-16 mb-8 text-center">
        <h5 className="text-sm uppercase tracking-wider mb-4 text-gray-600 dark:text-gray-300">
          Danh Mục
        </h5>
        <div className="flex flex-wrap gap-2 text-lg sm:text-2xl text-gray-800 dark:text-gray-100 justify-center">
          {[
            "Pizza",
            "Nui Bỏ Lò",
            "Combo",
            "Mỳ Ý",
            "Khai vị",
            "Đồ Uống",
            "Gà Nướng",
            "Gà Giòn",
            "Salad",
            "Bia",
            "Kem",
            "Món Ăn Kèm",
            "Gia vị & Sốt",
            "Bánh ngọt",
          ].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleClickCategory(cat)}
              className="hover:text-red-500 transition-colors"
            >
              {cat}
              {idx < 13 && <span className="mx-2 text-gray-400">/</span>}
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default SearchPage;
