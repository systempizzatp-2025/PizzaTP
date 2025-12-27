import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Share2,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Axios from "../utils/AxiosUser";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";
import valideURLConvert from "../utils/valideURLConvert";
import CommentUser from "../components/CommentUser";

const ProductDisplayPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const productId = params?.product?.split("-")?.slice(-1)[0];

  const [data, setData] = useState({
    name: "",
    image: [],
    sizes: [],
    bases: [],
    price: 0,
    discount: 0,
    description: "",
    more_details: {},
    type: "",
  });
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBase, setSelectedBase] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const inputRef = useRef([]);


  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setSelectedSize("");
    setSelectedBase("");
    setActiveTab("description");


    fetchProductDetails();
    fetchFavoriteStatus();
    fetchComments();
  }, [productId]);

  useEffect(() => {
    if (data.type) fetchRelatedProducts();
  }, [data.type]);

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
      });
      if (response.data.success) {
        setData(response.data.data);
        if (response.data.data.sizes.length > 0)
          setSelectedSize(response.data.data.sizes[0].name);
        if (response.data.data.bases.length > 0)
          setSelectedBase(response.data.data.bases[0].name);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.relatedProducts,
        data: { productId, type: data.type },
      });
      if (response.data.success) setRelatedProducts(response.data.data);
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchFavoriteStatus = async () => {
    const token = localStorage.getItem("accessToken");
    const hasRefreshToken = document.cookie.includes("refreshToken");
    if (!token && !hasRefreshToken) {
      setIsFavorite(false);
      return;
    }
    try {
      const res = await Axios({ ...SummaryApi.getUserFavorites });
      if (res.data.success)
        setIsFavorite(res.data.data.some((p) => p._id === productId));
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        setIsFavorite(false);
      } else {
        AxiosToastError(error);
      }
    }
  };

  const fetchComments = async () => {
    try {
      const res = await Axios({
        ...SummaryApi.getComments,
        data: { productId },
      });
      if (res.data.success) setComments(res.data.data);
    } catch (error) {}
  };

  const calculatePrices = () => {
    const basePrice = pricewithDiscount(data.price, data.discount);
    const sizePrice =
      data.sizes.find((s) => s.name === selectedSize)?.price || 0;
    const baseExtra =
      data.bases.find((b) => b.name === selectedBase)?.price || 0;
    const finalPrice = basePrice + sizePrice + baseExtra;
    const originalTotalPrice = data.price + sizePrice + baseExtra;
    return { finalPrice, originalTotalPrice };
  };

  const { finalPrice, originalTotalPrice } = calculatePrices();

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await Axios({
          ...SummaryApi.removeFavorite,
          url: `${SummaryApi.removeFavorite.url}/${productId}`,
        });
        setIsFavorite(false);
        toast.success("Đã xóa khỏi yêu thích");
      } else {
        await Axios({
          ...SummaryApi.addFavorite,
          data: { product: productId },
        });
        setIsFavorite(true);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const nextImage = () =>
    setSelectedImage((prev) => (prev + 1) % data.image.length);
  const prevImage = () =>
    setSelectedImage(
      (prev) => (prev - 1 + data.image.length) % data.image.length
    );

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.name,
          text: data.description,
          url: window.location.href,
        });
      } catch (error) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link vào clipboard");
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") setQuantity((prev) => prev + 1);
    else if (type === "decrease" && quantity > 1)
      setQuantity((prev) => prev - 1);
  };

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((acc, cur) => acc + cur.rating, 0) / comments.length
        ).toFixed(1)
      : "0.0";

  const ratingCount = Math.round(
    comments.length > 0
      ? comments.reduce((acc, cur) => acc + cur.rating, 0) / comments.length
      : 0
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-3 md:px-4 lg:px-6">
      <div className="container mx-auto pt-8  ">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm hover:shadow text-gray-700 hover:text-gray-900 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>

      <section className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group">
                <div className="flex items-center justify-center p-4 h-[460px]">
                  <img
                    src={data.image[selectedImage]}
                    alt={data.name}
                    className="w-full h-full object-scale-down transform  transition-transform duration-500"
                  />
                </div>

                {data.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {data.discount > 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      -{data.discount}%
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={toggleFavorite}
                    className={`p-1.5 rounded-full transition-all shadow-md ${
                      isFavorite
                        ? "bg-red-500 text-white"
                        : "bg-white/90 hover:bg-white text-gray-600"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </button>
                  <button
                    onClick={shareProduct}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all text-gray-600"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {data.image.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                  {data.image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg border overflow-hidden transition-all ${
                        selectedImage === index
                          ? "border-red-500 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === "description"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Mô tả
                  </button>
                  <button
                    onClick={() => setActiveTab("more_details")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                      activeTab === "more_details"
                        ? "text-red-600 border-b-2 border-red-600 bg-red-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>

              <div className="p-4">
                {activeTab === "description" && data.description && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {data.description}
                  </p>
                )}
                {activeTab === "more_details" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">
                          Loại:
                        </span>
                        <span className="text-gray-900 text-sm">
                          {data.type}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-700 text-sm">
                          Trạng thái:
                        </span>
                        <span className="text-green-600 font-medium text-sm">
                          Còn hàng
                        </span>
                      </div>
                    </div>

                    {data.more_details &&
                      Object.keys(data.more_details).length > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <h4 className="font-medium text-gray-900 mb-2 text-sm">
                            Thông tin chi tiết
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(data.more_details).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between py-1.5 px-2 bg-blue-50 rounded border border-blue-100"
                                >
                                  <span className="font-medium text-blue-700 text-xs capitalize">
                                    {key.replace(/_/g, " ")}:
                                  </span>
                                  <span className="text-blue-900 text-xs text-right">
                                    {value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="mt-3 font-semibold text-gray-800 text-2xl whitespace-nowrap overflow-hidden text-ellipsis">
                {data.name}
              </h1>
              <p className="text-gray-600 text-sm mb-3">{data.type}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= ratingCount
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 ml-1">
                    {averageRating}
                  </span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-600 text-sm">
                    {comments.length} đánh giá
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 mb-4">
                <span className="text-2xl font-bold text-red-600">
                  {DisplayPriceInVND(finalPrice)}
                </span>
                {data.discount > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-2">
                    <span className="text-lg line-through text-gray-500">
                      {DisplayPriceInVND(originalTotalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      Tiết kiệm{" "}
                      {DisplayPriceInVND(originalTotalPrice - finalPrice)}
                    </span>
                  </div>
                )}
              </div>

              {data.sizes.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">
                    Kích thước
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size.name)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          selectedSize === size.name
                            ? "border-red-500 bg-red-50 text-red-600 font-medium"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{size.name}</div>
                        {size.price > 0 && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            +{DisplayPriceInVND(size.price)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {data.bases.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-3 text-sm">
                    Loại đế
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.bases.map((base, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedBase(base.name)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          selectedBase === base.name
                            ? "border-red-500 bg-red-50 text-red-600 font-medium"
                            : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-medium">{base.name}</div>
                        {base.price > 0 && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            +{DisplayPriceInVND(base.price)}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center">
                <h3 className="font-medium text-gray-900 text-sm">Số lượng</h3>
                <div className="flex items-center pl-3 gap-3">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-lg border ${
                      quantity <= 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 rounded-lg border border-gray-300 hover:border-red-500 hover:text-red-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <AddToCartButton
                  data={data}
                  selectedSize={selectedSize}
                  selectedBase={selectedBase}
                  quantity={quantity}
                  selectedSizePrice={
                    data.sizes.find((s) => s.name === selectedSize)?.price || 0
                  }
                  selectedBasePrice={
                    data.bases.find((b) => b.name === selectedBase)?.price || 0
                  }
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 flex items-center justify-center gap-2 font-medium text-sm hover:from-red-600 hover:to-orange-600 transition-all duration-200 rounded-lg shadow-md hover:shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-6">
        <CommentUser
          productId={productId}
          comments={comments}
          setComments={setComments}
        />
      </section>

      {relatedProducts.length > 0 && (
        <section className="container mx-auto  py-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Có thể bạn thích
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-200"
                onClick={() =>
                  navigate(
                    `/san-pham/${valideURLConvert(item.name)}-${item._id}`
                  )
                }
              >
                <div className="relative overflow-hidden w-full bg-white flex items-center justify-center">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-full h-[240px] object-scale-down transform group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                      -{item.discount}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-xs line-clamp-2 mb-1 leading-tight min-h-[32px]">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-red-500 font-bold text-sm">
                      {DisplayPriceInVND(
                        pricewithDiscount(item.price, item.discount)
                      )}
                    </span>
                    {item.discount > 0 && (
                      <span className="text-gray-500 line-through text-xs">
                        {DisplayPriceInVND(item.price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDisplayPage;
