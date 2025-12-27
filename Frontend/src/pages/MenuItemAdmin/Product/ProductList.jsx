import React, { useState, useEffect } from "react";
import AxiosToastError from "../../../utils/AxiosToastError";
import Axios from "../../../utils/AxiosAdmin";
import SummaryApi from "../../../common/SummaryApi";
import Loading from "../../../components/Loading";
import ProductCardAdmin from "../../../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import NoData from "../../../components/NoData";

const ProductList = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page,
          limit: 12,
          search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProductData();
  }, [page]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProductData();
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <section className="min-h-screen flex flex-col">

      <div className="p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="font-bold text-xl text-gray-800">Danh sách sản phẩm</h2>

        <div className="flex items-center w-full md:w-80 bg-gray-100 px-4 py-2 rounded-full border border-gray-300 focus-within:border-blue-500">
          <IoSearchOutline size={22} className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent outline-none ml-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && <Loading />}


      <div className="flex-1 p-4 bg-gray-100 flex flex-col">
        <div className="flex-1">
          {productData.length === 0 && !loading ? (
            <div className="flex items-center justify-center h-full">
              <NoData />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {productData.map((p) => (
                <ProductCardAdmin
                  fetchProductData={fetchProductData}
                  key={p._id}
                  data={p}
                />
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="w-full p-4 bg-white shadow-inner flex items-center justify-between">
        <button
          onClick={() => page > 1 && setPage(page - 1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border"
        >
          Quay lại
        </button>

        <span className="text-gray-700 font-medium">
          {page} / {totalPageCount}
        </span>

        <button
          onClick={() => page < totalPageCount && setPage(page + 1)}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border"
        >
          Tiếp
        </button>
      </div>
    </section>
  );
};

export default ProductList;
