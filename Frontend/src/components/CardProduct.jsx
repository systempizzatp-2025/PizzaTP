import React, { useCallback, useState } from "react";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import { Link } from "react-router-dom";
import valideURLConvert from "../utils/valideURLConvert";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "./AddToCartButton";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  optimisticRemoveFavorite,
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../store/favoritesSlice";

const CardProduct = ({ data }) => {
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
        console.error("Toggle favorite error:", error);
        toast.error("Có lỗi xảy ra");
        dispatch(fetchFavorites());
      } finally {
        setIsProcessing(false);
      }
    },
    [data._id, isProductFavorite, dispatch]
  );

  const discountBadge = data?.discount > 0 && (
    <div className="text-blue-600 bg-blue-100 px-2 w-fit text-xs rounded-full">
      Giảm giá {data.discount}%
    </div>
  );

  const priceDisplay = (
    <span className="text-red-500 font-semibold text-lg">
      {DisplayPriceInVND(pricewithDiscount(data?.price, data.discount))}
    </span>
  );

  return (
    <Link
      to={url}
      className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden h-44 w-full bg-white flex items-center justify-center">
        <img
          src={data?.image?.[0]}
          alt={data?.name}
          className="w-full h-full object-scale-down transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-x-0 bottom-2 flex justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          <AddToCartButton
            data={data}
            className="w-40 text-xs px-3 py-1 rounded-md shadow-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          />
        </div>

        <button
          onClick={handleToggleFavorite}
          disabled={isProcessing || favoritesLoading}
          className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            isProductFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
          }
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isProductFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-300"
            }`}
          />
        </button>

        {isProcessing && (
          <div className="absolute top-2 right-2 p-2 bg-white/90 rounded-full z-20">
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          {discountBadge}
          <div className="w-9"></div>
        </div>

        <h3
          className="font-semibold text-lg text-gray-800 truncate"
          title={data?.name}
        >
          {data?.name}
        </h3>

        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span className="font-medium">
            Loại: <span className="text-gray-700">{data?.type}</span>
          </span>
          {priceDisplay}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
