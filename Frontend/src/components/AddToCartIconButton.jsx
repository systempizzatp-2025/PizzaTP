import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useGlobalContext } from "../provider/GlobalProvider";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";

const AddToCartIconButton = ({ product, className = "", title = "Thêm vào giỏ hàng" }) => {
  const { fetchCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.addTocart,
        data: {
          productId: product._id,
          size: null,
          base: null,
          sizePrice: 0,
          basePrice: 0,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message || "Đã thêm vào giỏ hàng!");
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        return;
      }

      if (error.response?.status === 400) {
        toast.error("Sản phẩm đã có trong giỏ hàng");
        return;
      }

      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`
        p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 
        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={title}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <FaShoppingCart size={16} />
      )}
    </button>
  );
};

export default AddToCartIconButton;