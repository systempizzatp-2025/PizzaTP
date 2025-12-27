import React, { useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";

const AddToCartButton = ({
  data,
  selectedSize,
  selectedBase,
  selectedSizePrice = 0,
  selectedBasePrice = 0,
  quantity = 1,
}) => {
  const { fetchCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleADDTocart = async (e) => {
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
          productId: data._id,
          size: selectedSize || null,
          base: selectedBase || null,
          sizePrice: selectedSizePrice,
          basePrice: selectedBasePrice,
          quantity: quantity,  
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Đã thêm vào giỏ hàng!");
        fetchCartItem && fetchCartItem();
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
    <div className="flex justify-center mt-4">
      <button
        onClick={handleADDTocart}
        disabled={loading}
        className="w-full max-w-xs bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2 uppercase text-xs hover:bg-red-600 transition-colors rounded-lg shadow-md"
      >
        {loading ? (
          <>
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Đang thêm...
          </>
        ) : (
          "Thêm vào giỏ hàng"
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;
