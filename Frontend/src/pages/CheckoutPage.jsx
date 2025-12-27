import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalContext } from "../provider/GlobalProvider";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import valideURLConvert from "../utils/valideURLConvert";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Store,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AddAddress from "../components/AddAddress";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import ApplyPromo from "../components/ApplyPromo";

const CheckoutPage = () => {

  const allCartItems = useSelector((state) => state.cartItem.cart);
  const addressList = useSelector((state) => state.address.addressList);
  const user = useSelector((state) => state.user);

  const [appliedDiscountCode, setAppliedDiscountCode] = useState(null);
  const [discountValue, setDiscountValue] = useState(0);
  const [groupedItems, setGroupedItems] = useState({});
  const location = useLocation();

  const {
    updateCartItem,
    deleteCartItem,
    fetchAddress,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();

  const [selectAddress, setSelectAddress] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const navigate = useNavigate();


  const [selectedCartItems, setSelectedCartItems] = useState([]);

  useEffect(() => {
 
    if (location.state?.selectedItems && allCartItems.length > 0) {
      const selectedIds = location.state.selectedItems;


      const filteredItems = allCartItems.filter((item) =>
        selectedIds.includes(item._id)
      );
    

      setSelectedCartItems(filteredItems);
    }
  
    else {
      const storedSelectedItems = localStorage.getItem("selectedCartItems");
    

      if (storedSelectedItems && allCartItems.length > 0) {
        try {
          const selectedIds = JSON.parse(storedSelectedItems);
        
          const filteredItems = allCartItems.filter((item) =>
            selectedIds.includes(item._id)
          );
    ;

          setSelectedCartItems(filteredItems);

    
          localStorage.removeItem("selectedCartItems");
        } catch (error) {
          console.error("Error parsing selected cart items:", error);
    
          setSelectedCartItems(allCartItems);
        }
      } else {
   
      
        setSelectedCartItems(allCartItems);
      }
    }
  }, [allCartItems, location.state]);

  useEffect(() => {
    if (selectedCartItems && selectedCartItems.length > 0) {
      const grouped = selectedCartItems.reduce((acc, item) => {
        const sellerId =
          item.productId?.seller?._id || item.productId?.sellerId || "default";
        if (!acc[sellerId])
          acc[sellerId] = { sellerId, items: [], sellerTotal: 0 };
        const basePrice = pricewithDiscount(
          item?.productId?.price,
          item?.productId?.discount
        );
        const sizePrice = item?.sizePrice || 0;
        const baseExtra = item?.basePrice || 0;
        const itemPrice = basePrice + sizePrice + baseExtra;
        const itemTotal = itemPrice * item.quantity;
        acc[sellerId].items.push({
          ...item,
          itemPrice,
          itemTotal, 
          displayPrice: itemPrice, 
          displayTotal: itemTotal,
        });
        acc[sellerId].sellerTotal += itemTotal;
        return acc;
      }, {});
      setGroupedItems(grouped);

    } else {
      setGroupedItems({});

    }
  }, [selectedCartItems]);

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrderController,
        data: {
          list_items: selectedCartItems,
          addressId: addressList[selectAddress]?._id,
          totalAmt: totalAfterDiscount,
          subTotalAmt: totalAfterDiscount,
          shippingMethod,
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        if (fetchCartItem) fetchCartItem();

      
        // if (fetchOrder) fetchOrder();

       
        navigate("/dat-hang-thanh-cong", {
          state: {
            orderId: response.data.data.orderId,
            message: "Đặt hàng thành công!",
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const calculateItemPrice = (item) => {
    const basePrice = pricewithDiscount(
      item?.productId?.price,
      item?.productId?.discount
    );
    const sizePrice = item?.sizePrice || 0;
    const baseExtra = item?.basePrice || 0;
    let finalPrice = basePrice + sizePrice + baseExtra;
    if (appliedDiscountCode && totalAfterDiscount < calculateTotal()) {
      const proportion = finalPrice / calculateTotal();
      finalPrice = finalPrice - proportion * discountValue;
    }
    return Math.round(finalPrice);
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Đang tải...");
      const itemsForPayment = selectedCartItems.map((item) => ({
        ...item,
        finalPrice: calculateItemPrice(item),
      }));
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: itemsForPayment,
          addressId: addressList[selectAddress]?._id,
          totalAmt: totalAfterDiscount,
          subTotalAmt: calculateTotal(),
          discountCode: appliedDiscountCode || null,
          shippingMethod,
        },
      });
      window.location.href = response.data.url;
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const [openAddress, setOpenAddress] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(id, newQuantity);
  };

  const removeItem = (id) => {
    deleteCartItem(id);
  };

  const calculateTotal = () => {
    return selectedCartItems.reduce((total, item) => {
      const basePrice = pricewithDiscount(
        item?.productId?.price,
        item?.productId?.discount
      );
      const sizePrice = item?.sizePrice || 0;
      const baseExtra = item?.basePrice || 0;
      const itemFinalPrice = basePrice + sizePrice + baseExtra;
      return total + itemFinalPrice * item.quantity;
    }, 0);
  };

  const calculateShippingFee = () => {
    if (shippingMethod === "express") {
      return 20000;
    }
    return 0;
  };

  const shippingFee = calculateShippingFee();
  const finalTotal = calculateTotal() + shippingFee;
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(finalTotal);


  const calculateDisplayPrice = (item) => {
    const basePrice = pricewithDiscount(
      item?.productId?.price,
      item?.productId?.discount
    );
    const sizePrice = item?.sizePrice || 0;
    const baseExtra = item?.basePrice || 0;
    return basePrice + sizePrice + baseExtra;
  };

  const calculateDisplayTotal = (item) => {
    return calculateDisplayPrice(item) * item.quantity;
  };




  if (!selectedCartItems || selectedCartItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-16 text-center min-h-screen flex flex-col justify-center items-center">
        <div className="w-24 h-24 mx-auto text-gray-300 mb-4 flex items-center justify-center">
          <ShoppingCart />
        </div>
        <h2 className="text-2xl font-semibold mb-2">
          {allCartItems.length === 0
            ? "Giỏ hàng trống"
            : "Không có sản phẩm nào được chọn"}
        </h2>
        <p className="text-gray-500 mb-6">
          {allCartItems.length === 0
            ? "Hãy thêm sản phẩm vào giỏ hàng để tiếp tục!"
            : "Vui lòng quay lại giỏ hàng và chọn sản phẩm để thanh toán!"}
        </p>
        <button
          onClick={() =>
            allCartItems.length === 0
              ? navigate("/thuc-don")
              : navigate("/cart")
          }
          className="bg-red-500 text-white px-8 py-3 rounded-lg uppercase font-semibold hover:bg-red-600 transition-colors shadow-lg"
        >
          {allCartItems.length === 0
            ? "Khám phá thực đơn"
            : "Quay lại giỏ hàng"}
        </button>
      </div>
    );
  }

  return (
    <section className="bg-white min-h-screen font-bold">
      <div className="container mx-auto pt-20 relative">
        <div className="flex pt-1 items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors absolute left-4"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Thanh toán ({selectedCartItems.length} sản phẩm)
          </h1>
        </div>
      </div>

      <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
            <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Địa chỉ giao hàng</span>
            </h3>
            <div className="space-y-2">
              {addressList
                .filter((addr) => addr.isDefault)
                .map((address, index) => (
                  <label
                    key={address._id}
                    htmlFor={"address" + index}
                    className="block"
                  >
                    <div className="bg-white p-3 rounded border border-gray-200 flex gap-3 cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors items-start">
                      <div className="pt-1">
                        <input
                          id={"address" + index}
                          type="radio"
                          value={index}
                          onChange={(e) =>
                            setSelectAddress(Number(e.target.value))
                          }
                          name="address"
                          defaultChecked={index === 0}
                          className="text-red-500 w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="lg:hidden">
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-800 text-sm truncate">
                                    {address.fullName}
                                  </p>
                                  <p className="text-gray-600 text-xs truncate">
                                    (+84){" "}
                                    {address.phoneNumber
                                      .replace(/(\+84|84|0)/, "")
                                      .replace(/\s/g, "")}
                                  </p>
                                </div>
                                {/* <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded ml-2 flex-shrink-0">
                                  Mặc định
                                </span> */}
                              </div>
                              <p className="text-gray-600 text-xs line-clamp-1">
                                {address.street}, {address.ward},{" "}
                                {address.district}, {address.city}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hidden lg:block">
                          <div className="flex justify-between items-start mb-1">
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">
                                {address.fullName} (+84){" "}
                                {address.phoneNumber
                                  .replace(/(\+84|84|0)/, "")
                                  .replace(/\s/g, "")}
                              </p>
                            </div>
                            {/* <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              Mặc định
                            </span> */}
                          </div>
                          <p className="text-gray-600 text-xs line-clamp-1">
                            {address.street}, {address.ward}, {address.district}
                            , {address.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
            </div>
            <div
              onClick={() => setOpenAddress(true)}
              className="mt-3 h-10 border border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-red-300 hover:bg-red-50 transition-colors text-red-500 text-sm font-medium"
            >
              + Thêm địa chỉ mới
            </div>
          </div>
          <div className="space-y-4">
            {Object.values(groupedItems).map((sellerGroup) => (
              <div
                key={sellerGroup.sellerId}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="divide-y divide-gray-100">
                  {sellerGroup.items.map((item, idx) => {
                 
                    const displayPrice = calculateDisplayPrice(item);
                    const displayTotal = calculateDisplayTotal(item);

                    return (
                      <div
                        key={item._id || idx}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item?.productId?.image?.[0]}
                            alt={item?.productId?.name}
                            className="w-20 h-20 object-contain rounded border border-gray-200 flex-shrink-0 cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/san-pham/${valideURLConvert(
                                  item?.productId?.name
                                )}-${item?.productId?._id}`
                              )
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3
                                className="text-base font-medium text-gray-800 hover:text-red-600 transition-colors cursor-pointer line-clamp-2"
                                onClick={() =>
                                  navigate(
                                    `/san-pham/${valideURLConvert(
                                      item?.productId?.name
                                    )}-${item?.productId?._id}`
                                  )
                                }
                              >
                                {item?.productId?.name}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item._id);
                                }}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 mt-2">
                              {item.size && (
                                <p>
                                  <span className="font-medium">
                                    Kích thước:
                                  </span>{" "}
                                  {item.size}
                                  {item.sizePrice > 0 &&
                                    ` (+${DisplayPriceInVND(item.sizePrice)})`}
                                </p>
                              )}
                              {item.base && (
                                <p>
                                  <span className="font-medium">Đế:</span>{" "}
                                  {item.base}
                                  {item.basePrice > 0 &&
                                    ` (+${DisplayPriceInVND(item.basePrice)})`}
                                </p>
                              )}
                              {item?.productId?.discount > 0 && (
                                <p className="text-green-600 font-medium">
                                  Giảm {item?.productId?.discount}%
                                </p>
                              )}
                            </div>
                            <div className="flex flex-row flex-wrap items-center justify-between mt-3 gap-2">
                              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity - 1)
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 font-medium min-w-[2.5rem] text-center text-base">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors text-gray-600"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="ml-auto text-right min-w-[5rem]">
                                <p className="text-lg font-bold text-red-600">
                                  {DisplayPriceInVND(displayTotal)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {DisplayPriceInVND(displayPrice)}/sản phẩm
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 bg-white rounded-lg shadow-lg p-4 sticky top-32 h-fit">
          <h2 className="text-lg font-bold uppercase mb-1.5 pb-1.5 border-b border-gray-300">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-2 mb-3">
            {Object.values(groupedItems).map((sellerGroup, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center gap-1">
                  <Store className="w-3 h-3 text-gray-600" />
                  <span className="font-medium text-gray-800 text-xs">
                    {sellerGroup.items.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}{" "}
                    sản phẩm
                  </span>
                </div>
                <div className="font-semibold text-red-600 text-sm">
                  {DisplayPriceInVND(sellerGroup.sellerTotal)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-3 pb-3 border-b border-gray-300">
            <h3 className="font-semibold text-gray-700 text-sm">
              Phương thức vận chuyển
            </h3>
            <div className="space-y-2">
              <label className="block">
                <div
                  className={`bg-white p-2 rounded border flex gap-2 cursor-pointer ${
                    shippingMethod === "standard"
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="standard"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    name="shipping"
                    checked={shippingMethod === "standard"}
                    className="text-red-500 w-3 h-3 mt-0.5"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800 text-xs">
                        Giao Nhanh
                      </p>
                      <p className="text-gray-600 text-xs">30-45 phút</p>
                    </div>
                    <span className="font-semibold text-green-600 text-xs">
                      Miễn phí
                    </span>
                  </div>
                </div>
              </label>
              <label className="block">
                <div
                  className={`bg-white p-2 rounded border flex gap-2 cursor-pointer ${
                    shippingMethod === "express"
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <input
                    type="radio"
                    value="express"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    name="shipping"
                    checked={shippingMethod === "express"}
                    className="text-red-500 w-3 h-3 mt-0.5"
                  />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800 text-xs">
                        Giao Hỏa Tốc
                      </p>
                      <p className="text-gray-600 text-xs">15-30 phút</p>
                    </div>
                    <span className="font-semibold text-gray-800 text-xs">
                      20,000₫
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <ApplyPromo
              userId={user?._id}
              orderTotal={calculateTotal() + shippingFee}
              setFinalTotal={(newTotal, promo = null, discount = 0) => {
                setTotalAfterDiscount(newTotal);
                setAppliedDiscountCode(promo?.code || null);
                setDiscountValue(discount);
              }}
            />
          </div>

          {appliedDiscountCode && discountValue > 0 && (
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded">
              <div className="flex justify-between text-green-700 text-xs">
                <span>
                  Mã: <span className="font-bold">{appliedDiscountCode}</span>
                </span>
                <span className="font-bold">
                  -{DisplayPriceInVND(discountValue)}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2 mb-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-semibold">
                {DisplayPriceInVND(calculateTotal())}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span
                className={`font-semibold ${
                  shippingMethod === "express"
                    ? "text-gray-800"
                    : "text-green-600"
                }`}
              >
                {shippingMethod === "express" ? "20,000₫" : "Miễn phí"}
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">
                  Tổng thanh toán:
                </span>
                <span className="text-lg font-bold text-red-600">
                  {DisplayPriceInVND(totalAfterDiscount)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleOnlinePayment}
              className="w-full bg-red-500 text-white py-2.5 rounded-lg uppercase font-bold hover:bg-red-600 transition-colors text-sm"
            >
              Thanh toán online
            </button>
            <button
              onClick={handleCashOnDelivery}
              className="w-full bg-white border border-red-500 text-red-500 py-2.5 rounded-lg uppercase font-bold hover:bg-red-50 transition-colors text-sm"
            >
              Thanh toán khi nhận hàng
            </button>
          </div>
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
