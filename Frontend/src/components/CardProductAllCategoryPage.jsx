import React, { useCallback, useState } from "react";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import { Link } from "react-router-dom";
import valideURLConvert from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  optimisticRemoveFavorite,
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../store/favoritesSlice";

const CardProductAllCategoryPage = ({ data, viewMode = "grid" }) => {
  const url = `/san-pham/${valideURLConvert(data.name)}-${data._id}`;

  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const favoritesLoading = useSelector((state) => state.favorites.loading);

  const isProductFavorite = favorites.some((item) => item._id === data._id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleFavorite = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Vui lòng đăng nhập để thêm vào yêu thích");
        return;
      }

      setIsProcessing(true);

      try {
        if (isProductFavorite) {
          dispatch(optimisticRemoveFavorite(data._id));
          toast.success("Đã xóa khỏi yêu thích");
          await dispatch(removeFavorite(data._id)).unwrap();
        } else {
          await dispatch(addFavorite(data._id)).unwrap();
          toast.success("Đã thêm vào yêu thích");
        }
        dispatch(fetchFavorites());
      } catch (error) {
        toast.error("Có lỗi xảy ra");
        dispatch(fetchFavorites());
      } finally {
        setIsProcessing(false);
      }
    },
    [data._id, isProductFavorite, dispatch]
  );

  // List View
  if (viewMode === "list") {
    return (
      <Link
        to={url}
        className="group flex flex-col sm:flex-row items-stretch gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-300 hover:shadow-md transition-all duration-300 w-full"
      >
        <div className="relative w-full sm:w-28 md:w-32 lg:w-36 aspect-square flex-shrink-0 bg-orange-50 rounded-xl overflow-hidden">
          <img
            src={data?.image?.[0]}
            alt={data?.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {data?.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
              -{data.discount}%
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                {data?.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Loại: {data?.type}</p>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={isProcessing || favoritesLoading}
              className="p-2 hover:bg-orange-50 rounded-full transition-colors flex-shrink-0"
              title={isProductFavorite ? "Bỏ yêu thích" : "Yêu thích"}
            >
              <Heart
                className={`w-5 h-5 ${
                  isProductFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-600">
                {DisplayPriceInVND(
                  pricewithDiscount(data?.price, data.discount)
                )}
              </span>
              {/* {data?.discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {DisplayPriceInVND(data?.price)}
                </span>
              )} */}
            </div>
            <AddToCartButton
              data={data}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2 justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              Thêm
            </AddToCartButton>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link to={url} className="block">
        <div className="relative overflow-hidden h-44 w-full bg-white flex items-center justify-center">
          <img
            src={data?.image?.[0]}
            alt={data?.name}
            className="w-full h-full object-scale-down transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          {data?.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{data.discount}%
            </div>
          )}

          <button
            onClick={handleToggleFavorite}
            disabled={isProcessing || favoritesLoading}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            title={isProductFavorite ? "Bỏ yêu thích" : "Yêu thích"}
          >
            <Heart
              className={`w-5 h-5 ${
                isProductFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 group-hover:text-red-400"
              }`}
            />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <AddToCartButton
              data={data}
              className="w-full py-2.5 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Thêm vào giỏ
            </AddToCartButton>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                {data?.name}
              </h3>
              <p className="text-xs text-gray-500 mt-2">Loại: {data?.type}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-orange-600">
                {DisplayPriceInVND(
                  pricewithDiscount(data?.price, data.discount)
                )}
              </div>
              {/* {data?.discount > 0 && (
                <div className="text-xs text-gray-400 line-through">
                  {DisplayPriceInVND(data?.price)}
                </div>
              )} */}
            </div>

            {/* Rating */}
            {/* <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">
                {data.rating || "4.5"}
              </span>
            </div> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardProductAllCategoryPage;
