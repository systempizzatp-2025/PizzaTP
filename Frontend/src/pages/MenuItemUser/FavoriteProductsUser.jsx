import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTimes } from "react-icons/fa";
import {
  fetchFavorites,
  removeFavorite,
  optimisticRemoveFavorite,
} from "../../store/favoritesSlice";
import AddToCartIconButton from "../../components/AddToCartIconButton";
import { DisplayPriceInVND } from "../../utils/DisplayPriceInVND";
import { pricewithDiscount } from "../../utils/PriceWithDiscount";
import toast from "react-hot-toast";
import noDataImage from "../../assets/no_data_pizza.png";

const FavoriteProductsUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items: favorites,
    loading,
    error,
  } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (favorites.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length]);

  useEffect(() => {
    if (error) {
      toast.error("Lỗi khi tải sản phẩm yêu thích");
    }
  }, [error]);

  const handleRemoveFavorite = useCallback(
    async (productId, productName) => {
      dispatch(optimisticRemoveFavorite(productId));

      toast.success(`Đã xóa "${productName}" khỏi yêu thích`);

      try {
        await dispatch(removeFavorite(productId)).unwrap();
      } catch (error) {
        toast.error("Lỗi khi xóa sản phẩm yêu thích");
        dispatch(fetchFavorites());
      }
    },
    [dispatch]
  );

  const handleCardClick = useCallback(
    (product) => {
      navigate(
        `/san-pham/${product.name.replace(/\s+/g, "-").toLowerCase()}-${
          product._id
        }`
      );
    },
    [navigate]
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
      <div className="relative">
        <div className="h-48 bg-gray-200"></div>
      </div>

      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>

        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="flex items-center gap-1 mt-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 bg-gray-200 rounded mr-1"></div>
            ))}
          </div>
        </div>

        <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-gray-50 p-4 md:p-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Sản phẩm yêu thích
            </h1>
            {!loading && favorites.length > 0 && (
              <p className="text-gray-600 mt-2">
                Tổng cộng:{" "}
                <span className="font-semibold text-red-500">
                  {favorites.length}
                </span>{" "}
                sản phẩm
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollBarCustom px-4 md:px-6 pb-6 mt-2">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8 text-center">
                <img
                  src={noDataImage}
                  alt="Không có sản phẩm yêu thích"
                  className="w-48 h-48 mx-auto mb-4 object-contain"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Chưa có sản phẩm yêu thích
                </h3>
                <p className="text-gray-600 mb-6">
                  Hãy thêm sản phẩm bạn yêu thích!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Khám phá ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 group"
                >
                  <div className="relative">
                    <button
                      onClick={() =>
                        handleRemoveFavorite(product._id, product.name)
                      }
                      className="absolute top-2 left-2 bg-white hover:bg-red-50 p-2 rounded-full shadow z-10 transition-colors"
                      title="Xóa khỏi yêu thích"
                    >
                      <FaTimes className="text-red-500" size={16} />
                    </button>

                    <div
                      className="relative overflow-hidden h-44 w-full bg-white flex items-center justify-center cursor-pointer"
                      onClick={() => handleCardClick(product)}
                    >
                      <img
                        src={
                          product.image?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="w-full h-full object-scale-down transform group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between">
                    <h3
                      className="font-medium text-gray-800 line-clamp-2 mb-2 cursor-pointer hover:text-red-600 transition-colors"
                      onClick={() => handleCardClick(product)}
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-red-500 font-bold text-lg">
                          {DisplayPriceInVND(
                            pricewithDiscount(product.price, product.discount)
                          )}
                        </div>
                        {product.discount > 0 && (
                          <div className="text-sm text-gray-400 line-through">
                            {DisplayPriceInVND(product.price)}
                          </div>
                        )}
                      </div>

                      <AddToCartIconButton
                        product={product}
                        title="Thêm vào giỏ hàng"
                      />
                    </div>

                    {product.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-sm">
                              {i < Math.floor(product.rating) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.rating})
                        </span>
                      </div>
                    )}

                    {product.sold && (
                      <div className="text-xs text-gray-500 mt-1">
                        Đã bán: {product.sold}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteProductsUser;
