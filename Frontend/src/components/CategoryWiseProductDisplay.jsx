import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import valideURLConvert from "../utils/valideURLConvert";

const CategoryWiseProductDisplay = ({ id, name, handleRedirect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const MOBILE_COUNT = 5;
  const DESKTOP_INITIAL = 5;
  const LOAD_MORE_COUNT = 5;

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id },
      });
      if (response.data.success) setData(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleShowMore = () =>
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  const handleShowLess = () => setVisibleCount(DESKTOP_INITIAL);

  const mobileProducts = data.slice(0, MOBILE_COUNT);
  const loadingCards = new Array(DESKTOP_INITIAL).fill(null);

  return (
    <section className="py-8 md:py-16">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold uppercase">
            {name}
          </h2>
          <Link
            to={`/${valideURLConvert(name)}-${id}/tat-ca`}
            className="text-xs md:text-sm uppercase underline hover:no-underline text-red-500"
          >
            {" "}
            Xem tất cả
          </Link>
        </div>

        {/* Mobile */}
        <div className="block md:hidden space-y-4">
          {loading ? (
            <div className="flex overflow-x-auto pb-2 space-x-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48">
                  <div className="bg-gray-200 rounded-lg h-48 animate-pulse" />
                </div>
              ))}
            </div>
          ) : mobileProducts.length > 0 ? (
            <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide -mx-3 px-3">
              {mobileProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex-shrink-0 w-48 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <Link
                    to={`/san-pham/${item.name
                      ?.replace(/\s+/g, "-")
                      .toLowerCase()}-${item._id}`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-full h-32 flex items-center justify-center p-2 bg-white relative">
                        <img
                          src={item.image?.[0]}
                          alt={item.name}
                          className="h-full w-auto object-contain"
                        />
                        {item.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                            -{item.discount}%
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-tight min-h-[40px]">
                          {item.name}
                        </h3>
                        {item.type && (
                          <div className="mt-auto mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {item.type}
                            </span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-base font-bold text-red-500">
                              {DisplayPriceInVND(
                                pricewithDiscount(item.price, item.discount)
                              )}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-xs line-through text-gray-500">
                                {DisplayPriceInVND(item.price)}
                              </span>
                            )}
                          </div>
                          {item.discount > 0 && (
                            <div className="mt-1">
                              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                Tiết kiệm{" "}
                                {DisplayPriceInVND(
                                  item.price -
                                    pricewithDiscount(item.price, item.discount)
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Không có sản phẩm</p>
          )}
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {loading && loadingCards.map((_, i) => <CardLoading key={i} />)}
          {!loading &&
            data
              .slice(0, visibleCount)
              .map((item) => <CardProduct data={item} key={item._id} />)}
        </div>

        {/* Desktop Buttons */}
        {!loading && data.length > DESKTOP_INITIAL && (
          <div className="hidden md:flex justify-center mt-8 md:mt-10">
            {visibleCount < data.length ? (
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition mx-2"
              >
                Xem thêm
              </button>
            ) : (
              <button
                onClick={handleShowLess}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 transition mx-2"
              >
                Thu gọn
              </button>
            )}
          </div>
        )}

        {/* Mobile Button */}
        {!loading && data.length > MOBILE_COUNT && (
          <div className="block md:hidden text-center mt-6">
            <button
              onClick={handleRedirect}
              className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
            >
              Xem tất cả {data.length} sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryWiseProductDisplay;
