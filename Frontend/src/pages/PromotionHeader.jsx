import React, { useState, useEffect } from "react";
import {
  MdCalendarToday,
  MdVisibility,
  MdContentCopy,
  MdWarning,
} from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import AxiosUser from "../utils/AxiosUser";
import toast from "react-hot-toast";

const PromotionHeader = () => {
  const [promotions, setPromotions] = useState([]);
  const [revealedCodes, setRevealedCodes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const fetchPromotions = async () => {
    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để xem khuyến mãi");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await AxiosUser.get("/api/v1/promotion/list");

      if (res.data.success) {
        const now = new Date();
        const activePromotions = res.data.promos
          .filter((promo) => {
            const startDate = new Date(promo.startDate);
            const endDate = new Date(promo.endDate);
            return promo.isActive && now >= startDate && now <= endDate;
          })
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
          .slice(0, 10);

        setPromotions(activePromotions);

        if (activePromotions.length === 0) {
          setError("Hiện chưa có khuyến mãi nào");
        }
      } else {
        setError("Không tải được danh sách khuyến mãi");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        setIsAuthenticated(false);
      } else if (err.response?.status === 403) {
        setError("Bạn không có quyền xem khuyến mãi");
      } else if (err.response?.status === 404) {
        setError("Không tìm thấy khuyến mãi");
      } else if (err.code === "ECONNABORTED") {
        setError("Kết nối quá thời gian. Vui lòng thử lại");
      } else if (!err.response) {
        setError("Không kết nối được server. Vui lòng kiểm tra mạng");
      } else {
        setError("Không tải được khuyến mãi. Vui lòng thử lại sau");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPromotions();
    } else {
      setError("Vui lòng đăng nhập để xem khuyến mãi");
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleRevealCode = (promoId) => {
    setRevealedCodes((prev) => ({
      ...prev,
      [promoId]: true,
    }));
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(`Đã sao chép mã: ${code}`))
      .catch(() => toast.error("Không thể sao chép mã. Vui lòng thử lại"));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleLoginRedirect = () => {
    window.location.href = "/dang-nhap";
  };

  const handleRetry = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
      fetchPromotions();
    } else {
      handleLoginRedirect();
    }
  };

  if (loading) {
    return (
      <div className="min-h-70vh bg-gray-50 pt-20 mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600">Đang tải khuyến mãi...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-70vh bg-gray-50 pt-20 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex justify-center gap-3">
              {!isAuthenticated ? (
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Đăng nhập ngay
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  Thử lại
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-70vh bg-gray-50 pt-20 mt-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Khuyến mãi đang có
          </h1>
          <p className="text-gray-600 mt-1">
            Nhận mã giảm giá và ưu đãi đặc biệt
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {promotions.map((promo) => {
            const isRevealed = revealedCodes[promo._id];
            const isPercent = promo.discountType === "Percent";
            const daysRemaining = getDaysRemaining(promo.endDate);
            const remainingUses = promo.usageLimit - (promo.usedCount || 0);
            const isOutOfUses = remainingUses <= 0;
            const isExpired = daysRemaining === 0;

            return (
              <div
                key={promo._id}
                className={`bg-white rounded-lg border transition-all duration-300 hover:shadow-md ${
                  isExpired ? "border-gray-300 opacity-75" : "border-gray-200"
                }`}
              >
                <div
                  className={`p-3 text-white rounded-t-lg ${
                    isExpired
                      ? "bg-gray-500"
                      : "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-sm line-clamp-2 break-words flex-1">
                      {promo.name || promo.description}
                    </span>
                    {daysRemaining <= 3 && daysRemaining > 0 && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold ml-2 flex-shrink-0 whitespace-nowrap">
                        {daysRemaining} ngày
                      </span>
                    )}
                    {isExpired && (
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-bold ml-2 flex-shrink-0 whitespace-nowrap">
                        Hết hạn
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-black/20 rounded px-3 py-2">
                    {!isRevealed ? (
                      <>
                        <div className="flex items-center overflow-hidden">
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2 bg-white rounded-full"
                              ></div>
                            ))}
                          </div>
                          <span className="text-orange-200 text-sm ml-2 truncate">
                            ••••••••
                          </span>
                        </div>
                        <button
                          onClick={() => handleRevealCode(promo._id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap ${
                            isOutOfUses || isExpired
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-white/20 hover:bg-white/30"
                          }`}
                          disabled={isOutOfUses || isExpired}
                          title={
                            isOutOfUses
                              ? "Đã hết lượt dùng"
                              : isExpired
                              ? "Đã hết hạn"
                              : "Xem mã"
                          }
                        >
                          <MdVisibility className="w-4 h-4" />
                          <span className="hidden sm:inline">Xem mã</span>
                          <span className="sm:hidden">Xem</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <code className="text-white font-mono font-bold text-sm tracking-wider truncate">
                          {promo.code}
                        </code>
                        <button
                          onClick={() => handleCopyCode(promo.code)}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium flex-shrink-0 ml-2 whitespace-nowrap"
                          title="Sao chép mã"
                        >
                          <MdContentCopy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy</span>
                          <span className="sm:hidden">Sao chép</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Giá trị:</span>
                    <span className="text-green-600 font-bold text-lg">
                      {isPercent
                        ? `-${promo.discountValue}%`
                        : promo.discountType === "FreeShip"
                        ? "Free ship"
                        : `-${formatCurrency(promo.discountValue)}`}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {promo.minOrderAmount > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiShoppingCart className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">
                          Đơn tối thiểu: {formatCurrency(promo.minOrderAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MdCalendarToday className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">
                        HSD:{" "}
                        {new Date(promo.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="text-sm">
                      {isOutOfUses ? (
                        <div className="flex items-center gap-1 text-red-500 font-medium">
                          <MdWarning className="w-4 h-4" />
                          <span>Đã hết lượt dùng</span>
                        </div>
                      ) : remainingUses > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Còn lại:</span>
                          <span className="font-medium text-orange-600">
                            {remainingUses} lượt
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {promo.description && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {promo.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {promotions.length === 0 && !loading && !error && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-20 h-20 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                ></path>
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">Chưa có khuyến mãi nào</p>
            <p className="text-gray-400 text-sm">
              Quay lại sau để nhận ưu đãi mới nhé!
            </p>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
          <h3 className="font-bold text-gray-800 mb-4 text-center text-lg sm:text-xl">
            Hướng dẫn sử dụng mã giảm giá
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                1
              </div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Nhấn "Xem" để hiển thị mã
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Mã sẽ được hiển thị sau khi nhấn
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                2
              </div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Sao chép mã khi đặt hàng
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Dán mã vào ô "Mã giảm giá" khi thanh toán
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                3
              </div>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Mỗi mã có lượt dùng giới hạn
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Sử dụng sớm để không bỏ lỡ ưu đãi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionHeader;
