import React, { useState, useEffect } from "react";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import toast from "react-hot-toast";

const ApplyPromo = ({ userId, orderTotal, setFinalTotal }) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!appliedPromo) setFinalTotal(orderTotal, null, 0);
  }, [orderTotal, appliedPromo, setFinalTotal]);

  const handleApplyPromo = async () => {
    if (!promoCode) {
      setDiscount(0);
      setAppliedPromo(null);
      setFinalTotal(orderTotal, null, 0);
      return;
    }

    try {

      const validateRes = await Axios({
        ...SummaryApi.validatePromotion,
        data: { code: promoCode, userId, orderTotal },
      });

      const { discount, finalPrice, promo } = validateRes.data;


      await Axios({
        ...SummaryApi.redeemPromotion,
        data: { code: promoCode, userId },
      });


      setDiscount(discount);
      setAppliedPromo(promo);
      setFinalTotal(finalPrice, promo, discount);
      toast.success(`Áp dụng thành công! Giảm ${DisplayPriceInVND(discount)}`);
    } catch (err) {
      setDiscount(0);
      setAppliedPromo(null);
      setFinalTotal(orderTotal, null, 0);
      toast.error(err.response?.data?.message || "Mã không hợp lệ");
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-normal mb-2">
        Mã giảm giá (không bắt buộc):
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Nhập mã..."
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="w-full flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg 
          focus:border-red-500 focus:outline-none text-sm placeholder-lowercase placeholder-normal" />
        <button
          onClick={handleApplyPromo}
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-lg  hover:bg-gray-700 transition-colors font-normal text-sm" >
          Áp dụng
        </button>
      </div>

      {appliedPromo && (
        <div className="mt-2 text-green-600 font-medium">
          Mã {appliedPromo.code} áp dụng thành công! Giảm{" "}
          {DisplayPriceInVND(discount)}
        </div>
      )}
    </div>
  );
};

export default ApplyPromo;
