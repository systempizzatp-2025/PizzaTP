import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MdMenu,
  MdClose,
  MdLocalShipping,
  MdPhone,
  MdAttachMoney,
  MdOutlineTimer,
  MdLogout,
  MdDirections,
  MdMyLocation,
  MdZoomIn,
  MdZoomOut,
  MdCheckCircle,
  MdDeliveryDining,
  MdGpsFixed,
  MdGpsNotFixed,
  MdNavigateNext,
  MdLocationPin,
  MdStore,
  MdPersonPin,
  MdDirectionsBike,
  MdShoppingBag,
  MdCancel,
  MdStorefront,
  MdHome,
  MdHistory,
  MdCheck,
  MdArrowForward,
  MdSearch,
  MdRefresh,
  MdLocationOn,
  MdPhoneIphone,
  MdLocalPizza,
  MdInventory,
} from "react-icons/md";
import logo from "../assets/logo_tp.png";
import toast from "react-hot-toast";
import axios from "axios";
import { User } from "lucide-react";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/AxiosDelivery";
import { DisplayPriceInVND } from "../utils/DisplayPriceInVND";
import ProfileDelivery from "../pages/MenuItemDelivery/ProfileDelivery";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const BRANCHES = [
  {
    id: "GO_VAP",
    name: "Chi nhánh Gò Vấp",
    position: [10.846129, 106.668837],
    address:
      "226/106 Đ. Nguyễn Văn Lượng, Phường 17, Gò Vấp, Thành phố Hồ Chí Minh",
  },
];

const STORAGE_KEYS = {
  ONLINE_STATUS: "delivery_online_status",
  CURRENT_ORDER: "delivery_current_order",
  DELIVERY_STATUS: "delivery_status",
  EARNINGS_TODAY: "delivery_earnings_today",
  DELIVERED_COUNT: "delivery_count_today",
  DELIVERED_ORDERS: "delivery_delivered_orders",
  LAST_RESET_DATE: "delivery_last_reset_date",
  SHIPPER_STATS: "delivery_shipper_stats",
};

const geocodeAddress = async (address) => {
  try {
    if (!address || address.trim() === "") {
      toast.error("Địa chỉ không hợp lệ");
      return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&addressdetails=1&limit=1`,
      {
        headers: {
          "Accept-Language": "vi",
          "User-Agent": "PizzaDeliveryApp/1.0",
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const position = [parseFloat(result.lat), parseFloat(result.lon)];

      return position;
    } else {
      const addressParts = address.split(",");
      let searchQuery = address;

      for (let i = addressParts.length - 1; i >= 0; i--) {
        const testQuery = addressParts.slice(i).join(",").trim();
        if (testQuery.length > 5) {
          try {
            const fallbackResponse = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                testQuery
              )}&limit=1`,
              {
                headers: {
                  "Accept-Language": "vi",
                  "User-Agent": "PizzaDeliveryApp/1.0",
                },
                timeout: 5000,
              }
            );

            if (fallbackResponse.data && fallbackResponse.data.length > 0) {
              const result = fallbackResponse.data[0];
              const position = [parseFloat(result.lat), parseFloat(result.lon)];

              return position;
            }
          } catch (fallbackError) {}
        }
      }

      toast.error("Không tìm thấy vị trí trên bản đồ");
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);

    // if (error.code === "ECONNABORTED") {
    //   toast.error("Quá thời gian tìm kiếm vị trí");
    // } else if (error.response?.status === 429) {
    //   toast.error("Quá nhiều yêu cầu, vui lòng thử lại sau");
    // } else {
    //   toast.error("Lỗi tìm kiếm vị trí");
    // }

    return null;
  }
};

const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`,
      {
        headers: {
          "Accept-Language": "vi",
          "User-Agent": "PizzaDeliveryApp/1.0",
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.display_name) {
      return response.data.display_name;
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};

const DashboardDelivery = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ONLINE_STATUS);
    return saved ? JSON.parse(saved) : false;
  });
  const [currentOrder, setCurrentOrder] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ORDER);
    return saved ? JSON.parse(saved) : null;
  });
  const [deliveryStatus, setDeliveryStatus] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERY_STATUS);
    return saved || "idle";
  });
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      const refreshPromises = [];

      if (isOnline) {
        refreshPromises.push(fetchOrders());
        refreshPromises.push(fetchDeliveredOrders());
      }

      refreshPromises.push(getCurrentLocation());
      refreshPromises.push(fetchShipperStats());

      await Promise.all(refreshPromises);

      toast.success("Đã làm mới dữ liệu thành công!");
    } catch (error) {
      console.error("Error refreshing:", error);
      toast.error("Không thể làm mới dữ liệu");
    } finally {
      setIsRefreshing(false);
    }
  };
  const [currentLocation, setCurrentLocation] = useState([
    10.846129, 106.668837,
  ]);
  const [zoom, setZoom] = useState(14);
  const [route, setRoute] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState("Chưa lấy");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = useRef(null);

  const [shipperStats, setShipperStats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIPPER_STATS);
    return saved
      ? JSON.parse(saved)
      : {
          today: { totalOrders: 0, totalEarnings: 0 },
          allTime: { totalOrders: 0, totalEarnings: 0, averageEarnings: 0 },
          shipperName: "",
        };
  });

  const [earningsToday, setEarningsToday] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EARNINGS_TODAY);
    return saved ? parseFloat(saved) : 0;
  });
  const [deliveredCount, setDeliveredCount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERED_COUNT);
    return saved ? parseInt(saved) : 0;
  });
  const [rating, setRating] = useState(4.8);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERED_ORDERS);
    return saved ? JSON.parse(saved) : [];
  });
  const [userInfo, setUserInfo] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ONLINE_STATUS, JSON.stringify(isOnline));
  }, [isOnline]);

  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_ORDER,
        JSON.stringify(currentOrder)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ORDER);
    }
  }, [currentOrder]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELIVERY_STATUS, deliveryStatus);
  }, [deliveryStatus]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.EARNINGS_TODAY,
      shipperStats.today.totalEarnings.toString()
    );
  }, [shipperStats.today.totalEarnings]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.DELIVERED_COUNT,
      shipperStats.today.totalOrders.toString()
    );
  }, [shipperStats.today.totalOrders]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHIPPER_STATS,
      JSON.stringify(shipperStats)
    );
  }, [shipperStats]);

  useEffect(() => {
    fetchUserInfo();
    getCurrentLocation();
    fetchShipperStats();
  }, []);

  useEffect(() => {
    if (isOnline) {
      fetchOrders();
      fetchDeliveredOrders();
      checkCurrentDelivery();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    } else {
      setOrders([]);
    }
  }, [isOnline]);

  const fetchUserInfo = async () => {
    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/thong-tin-nhan-vien-giao-hang",
        method: "get",
      });
      if (response.data.success) {
        setUserInfo(response.data.data);

        setShipperStats((prev) => ({
          ...prev,
          shipperName: response.data.data.name,
        }));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchShipperStats = async () => {
    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/thong-ke-shipper",
        method: "get",
      });

      if (response.data.success) {
        const stats = response.data.data;
        setShipperStats({
          today: stats.today,
          allTime: stats.allTime,
          shipperName: stats.shipperName || userInfo?.name || "",
        });

        setEarningsToday(stats.today.totalEarnings);
        setDeliveredCount(stats.today.totalOrders);

        localStorage.setItem(
          STORAGE_KEYS.EARNINGS_TODAY,
          stats.today.totalEarnings.toString()
        );
        localStorage.setItem(
          STORAGE_KEYS.DELIVERED_COUNT,
          stats.today.totalOrders.toString()
        );
        localStorage.setItem(STORAGE_KEYS.SHIPPER_STATS, JSON.stringify(stats));

        if (stats.today.orders && stats.today.orders.length > 0) {
          const formattedOrders = stats.today.orders.map((order) => {
            let customerAddress = "Đang cập nhật";
            if (order.deliveryAddress) {
              const addr = order.deliveryAddress;
              customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
                addr.district || ""
              }, ${addr.city || ""}`.trim();
              if (customerAddress === ",") {
                customerAddress = "Đang cập nhật";
              }
            }

            return {
              orderId: order.orderId,
              amount: order.amount || 0,
              deliveredAt: order.deliveredAt || new Date(),
              status: "delivered",
              customer: order.customerName || "Khách hàng",
              customerAddress: customerAddress,
              customerPhone: order.customerPhone || "",
              orderTime: new Date(
                order.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              deliveryTime: new Date(
                order.deliveredAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              distance: order.distance || "0.00km",
              products: order.products || [],
              storeAddress: "Chi nhánh Gò Vấp",
            };
          });

          setDeliveredOrders(formattedOrders);
          localStorage.setItem(
            STORAGE_KEYS.DELIVERED_ORDERS,
            JSON.stringify(formattedOrders)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching shipper stats:", error);

      const savedStats = localStorage.getItem(STORAGE_KEYS.SHIPPER_STATS);
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        setShipperStats(parsedStats);
        setEarningsToday(parsedStats.today.totalEarnings);
        setDeliveredCount(parsedStats.today.totalOrders);
      }
    }
  };

  const checkCurrentDelivery = async () => {
    try {
      const savedOrder = localStorage.getItem(STORAGE_KEYS.CURRENT_ORDER);
      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);
        setCurrentOrder(parsedOrder);
        setDeliveryStatus("to_delivery");

        const response = await Axios({
          url: "/api/v1/nhan-vien-giao-hang/don-hang-dang-giao",
          method: "get",
        });

        if (response.data.success && response.data.data) {
          const orderData = response.data.data;
          const restoredOrder = await formatOrderData(orderData);
          setCurrentOrder(restoredOrder);
          toast.info(`Tiếp tục giao đơn ${restoredOrder.orderId}`);
        }
      } else {
        const response = await Axios({
          url: "/api/v1/nhan-vien-giao-hang/don-hang-dang-giao",
          method: "get",
        });

        if (response.data.success && response.data.data) {
          const orderData = response.data.data;
          const restoredOrder = await formatOrderData(orderData);
          setCurrentOrder(restoredOrder);
          setDeliveryStatus("to_delivery");
          toast.info(`Tiếp tục giao đơn ${restoredOrder.orderId}`);
        }
      }
    } catch (error) {
      console.error("Error checking current delivery:", error);
    }
  };

  const formatOrderData = async (orderData) => {
    let customerPosition = [10.846129, 106.668837];
    let customerAddress = "";

    if (orderData.delivery_address?.coordinates) {
      const coords = orderData.delivery_address.coordinates;
      if (coords.lat && coords.lng) {
        customerPosition = [coords.lat, coords.lng];
      } else if (Array.isArray(coords) && coords.length === 2) {
        customerPosition = coords;
      }
    }

    if (orderData.delivery_address) {
      const addr = orderData.delivery_address;

      customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
        addr.district || ""
      }, ${addr.city || ""}`.trim();

      if (customerAddress === ",") {
        customerAddress = "Đang cập nhật";
      }

      if (
        (!customerPosition || customerPosition[0] === 10.846129) &&
        customerAddress
      ) {
        setIsGeocoding(true);
        const geocodedPosition = await geocodeAddress(customerAddress);
        if (geocodedPosition) {
          customerPosition = geocodedPosition;
        }
        setIsGeocoding(false);
      }
    }

    if (
      !customerPosition ||
      (customerPosition[0] === 10.846129 && customerPosition[1] === 106.668837)
    ) {
    }

    const nearestBranch = findNearestBranch(customerPosition);

    const distance = calculateAccurateDistance(
      nearestBranch.position[0],
      nearestBranch.position[1],
      customerPosition[0],
      customerPosition[1]
    ).toFixed(2);

    const estimatedMinutes = calculateEstimatedTime(parseFloat(distance));

    return {
      orderId: orderData.orderId,
      customer: orderData.customer?.name || "Khách hàng",
      customerAddress: customerAddress || "Đang cập nhật",
      customerPosition: customerPosition,
      storeName: nearestBranch.name,
      storeAddress: nearestBranch.address,
      storePosition: nearestBranch.position,
      amount: orderData.totalAmount || 0,
      deliveryFee: 0,
      tip: 0,
      status: "delivering",
      distance: `${distance}km`,
      estimatedDeliveryTime: `${estimatedMinutes} phút`,
      customerPhone:
        orderData.customer?.phone ||
        orderData.delivery_address?.phoneNumber ||
        "",
      items:
        orderData.products?.map((p) => p.product_details?.name || "Sản phẩm") ||
        [],
      products: orderData.products || [],
      rawDeliveryAddress: orderData.delivery_address,
    };
  };

  const fetchOrders = async () => {
    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/danh-sach-don-hang",
        method: "get",
      });

      if (response.data.success) {
        const ordersPromises = response.data.data
          .filter((order) => order.status === "pending")
          .map(async (order, index) => await formatOrderForList(order, index));

        const ordersFromDB = await Promise.all(ordersPromises);
        setOrders(ordersFromDB);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatOrderForList = async (order, index) => {
    let customerPosition = [10.846129, 106.668837];
    let customerAddress = "";

    if (order.delivery_address?.coordinates) {
      const coords = order.delivery_address.coordinates;
      if (coords.lat && coords.lng) {
        customerPosition = [coords.lat, coords.lng];
      } else if (Array.isArray(coords) && coords.length === 2) {
        customerPosition = coords;
      }
    }

    if (order.delivery_address) {
      const addr = order.delivery_address;
      customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
        addr.district || ""
      }, ${addr.city || ""}`.trim();

      if (customerAddress === ",") {
        customerAddress = "Đang cập nhật";
      }

      if (
        (!customerPosition || customerPosition[0] === 10.846129) &&
        customerAddress
      ) {
        setIsGeocoding(true);
        const geocodedPosition = await geocodeAddress(customerAddress);
        if (geocodedPosition) {
          customerPosition = geocodedPosition;
        }
        setIsGeocoding(false);
      }
    }

    const nearestBranch = findNearestBranch(customerPosition);

    const distance = calculateAccurateDistance(
      nearestBranch.position[0],
      nearestBranch.position[1],
      customerPosition[0],
      customerPosition[1]
    ).toFixed(2);

    const estimatedMinutes = calculateEstimatedTime(parseFloat(distance));

    return {
      id: index + 1,
      _id: order.orderId,
      orderId: order.orderId,
      customer: order.customer?.name || "Khách hàng",
      customerAddress: customerAddress || "Đang cập nhật",
      customerPosition: customerPosition,
      storeId: nearestBranch.id,
      storeName: nearestBranch.name,
      storeAddress: nearestBranch.address,
      storePosition: nearestBranch.position,
      amount: order.totalAmount || 0,
      deliveryFee: 0,
      tip: 0,
      status: "available",
      orderTime: new Date(order.createdAt || Date.now()).toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
      pickupTime: null,
      deliveryTime: null,
      distance: `${distance}km`,
      estimatedPickupTime: "5 phút",
      estimatedDeliveryTime: `${estimatedMinutes} phút`,
      customerPhone:
        order.customer?.phone || order.delivery_address?.phoneNumber || "",
      items:
        order.products?.map((p) => p.product_details?.name).slice(0, 2) || [],
      products: order.products || [],
      note: "",
      paymentMethod: "cash",
      deliveryType: "standard",
      isPrepaid: false,
      isCurrentShipper: order.isCurrentShipper || false,
      rawDeliveryAddress: order.delivery_address,
    };
  };

  const fetchDeliveredOrders = async () => {
    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/danh-sach-don-da-giao",
        method: "get",
      });

      if (response.data.success) {
        const deliveredOrdersPromises = response.data.data.map(
          async (order, index) => {
            let customerPosition = [10.846129, 106.668837];
            let customerAddress = "";

            if (order.delivery_address?.coordinates) {
              const coords = order.delivery_address.coordinates;
              if (coords.lat && coords.lng) {
                customerPosition = [coords.lat, coords.lng];
              }
            }

            if (order.delivery_address) {
              const addr = order.delivery_address;
              customerAddress = `${addr.street || ""}, ${addr.ward || ""}, ${
                addr.district || ""
              }, ${addr.city || ""}`.trim();

              if (customerAddress === ",") {
                customerAddress = "Đang cập nhật";
              }
            }

            const nearestBranch = findNearestBranch(customerPosition);
            const distance = calculateAccurateDistance(
              nearestBranch.position[0],
              nearestBranch.position[1],
              customerPosition[0],
              customerPosition[1]
            ).toFixed(2);

            return {
              _id: order.orderId,
              orderId: order.orderId,
              customer: order.customer?.name || "Khách hàng",
              customerAddress: customerAddress || "Đang cập nhật",
              amount: order.totalAmount || 0,
              deliveryFee: 0,
              tip: 0,
              status: "delivered",
              orderTime: new Date(
                order.createdAt || Date.now()
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              deliveryTime:
                order.deliveryTime ||
                new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              distance: `${distance}km`,
              customerPhone: order.customer?.phone || "",
              items:
                order.products
                  ?.map((p) => p.product_details?.name)
                  .slice(0, 2) || [],
              products: order.products || [],
              rawDeliveryAddress: order.delivery_address,
              storeAddress: "Chi nhánh Gò Vấp",
            };
          }
        );

        const deliveredOrdersFromDB = await Promise.all(
          deliveredOrdersPromises
        );

        const uniqueOrders = Array.from(
          new Map(
            [...deliveredOrdersFromDB, ...deliveredOrders].map((order) => [
              order.orderId,
              order,
            ])
          ).values()
        );
        setDeliveredOrders(uniqueOrders);
        localStorage.setItem(
          STORAGE_KEYS.DELIVERED_ORDERS,
          JSON.stringify(uniqueOrders)
        );
      }
    } catch (error) {
      console.error("Error fetching delivered orders:", error);
    }
  };

  const findNearestBranch = (customerPosition) => {
    let nearestBranch = BRANCHES[0];
    let minDistance = calculateAccurateDistance(
      customerPosition[0],
      customerPosition[1],
      BRANCHES[0].position[0],
      BRANCHES[0].position[1]
    );

    for (let i = 1; i < BRANCHES.length; i++) {
      const distance = calculateAccurateDistance(
        customerPosition[0],
        customerPosition[1],
        BRANCHES[i].position[0],
        BRANCHES[i].position[1]
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestBranch = BRANCHES[i];
      }
    }

    return nearestBranch;
  };

  const calculateAccurateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateEstimatedTime = (distanceKm) => {
    if (distanceKm <= 2) return Math.round(distanceKm * 8);
    if (distanceKm <= 5) return Math.round(distanceKm * 6);
    return Math.round(distanceKm * 5);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("deliveryRefreshToken");

    try {
      const response = await Axios({
        ...SummaryApi.logoutDelivery,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (response.data.success) {
        localStorage.removeItem("deliveryAccessToken");
        localStorage.removeItem("deliveryRefreshToken");
        localStorage.removeItem(STORAGE_KEYS.CURRENT_ORDER);
        localStorage.removeItem(STORAGE_KEYS.DELIVERY_STATUS);
        localStorage.removeItem(STORAGE_KEYS.ONLINE_STATUS);
        localStorage.removeItem(STORAGE_KEYS.SHIPPER_STATS);
        localStorage.removeItem(STORAGE_KEYS.DELIVERED_ORDERS);
        localStorage.removeItem(STORAGE_KEYS.EARNINGS_TODAY);
        localStorage.removeItem(STORAGE_KEYS.DELIVERED_COUNT);

        toast.success("Đăng xuất thành công!", {
          duration: 2000,
        });

        setTimeout(() => {
          window.location.href = "/nhan-vien-giao-hang/dang-nhap";
        }, 1000);
      } else {
        toast.error(response.data.message || "Đăng xuất thất bại");
      }
    } catch (error) {
      console.error("Logout error:", error);

      localStorage.removeItem("deliveryAccessToken");
      localStorage.removeItem("deliveryRefreshToken");
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ORDER);
      localStorage.removeItem(STORAGE_KEYS.DELIVERY_STATUS);
      localStorage.removeItem(STORAGE_KEYS.ONLINE_STATUS);
      localStorage.removeItem(STORAGE_KEYS.SHIPPER_STATS);
      localStorage.removeItem(STORAGE_KEYS.DELIVERED_ORDERS);
      localStorage.removeItem(STORAGE_KEYS.EARNINGS_TODAY);
      localStorage.removeItem(STORAGE_KEYS.DELIVERED_COUNT);

      toast.success("Đăng xuất thành công!", {
        duration: 2000,
      });

      setTimeout(() => {
        window.location.href = "/nhan-vien-giao-hang/dang-nhap";
      }, 500);
    }
  };

  const callShipper = (phone) => {
    window.open(`tel:${phone}`, "_blank");
  };
  const storeIcon = L.divIcon({
    html: `
    <div style="
      background-color: #ef4444; 
      width: 42px; 
      height: 42px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="white">
        <path d="M12 2L2 7v10h2v8h16v-8h2V7L12 2zm-2 18v-8h4v8h-4zm6 0v-8h4v4h-4v4zm-12-4v-4h4v4H4zm14-6h-4V4h4v10zm-10 0H4V9l8-3 8 3v5h-4V4h-4v10z"/>
      </svg>
    </div>`,
    iconSize: [42, 42],
    className: "custom-marker",
  });

  const customerIcon = L.divIcon({
    html: `
    <div style="
      background-color: #10b981; 
      width: 42px; 
      height: 42px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="white">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
    </div>`,
    iconSize: [42, 42],
    className: "custom-marker",
  });

  const driverIcon = L.divIcon({
    html: `
    <div style="
      background-color: #3b82f6; 
      width: 42px; 
      height: 42px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="white">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
      </svg>
    </div>`,
    iconSize: [42, 42],
    className: "custom-marker",
  });

  const availableOrderIcon = L.divIcon({
    html: `
    <div style="
      background-color: #f59e0b; 
      width: 42px; 
      height: 42px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="white">
        <path d="M21 6h-4c0-2.21-1.79-4-4-4S9 3.79 9 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm10 16H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/>
      </svg>
    </div>`,
    iconSize: [42, 42],
    className: "custom-marker",
  });

  const deliveringOrderIcon = L.divIcon({
    html: `
    <div style="
      background-color: #8b5cf6; 
      width: 42px; 
      height: 42px; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    ">
      <svg style="width: 22px; height: 22px;" viewBox="0 0 24 24" fill="white">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    </div>`,
    iconSize: [42, 42],
    className: "custom-marker",
  });

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        toast.error("Trình duyệt không hỗ trợ định vị");
        reject(new Error("Trình duyệt không hỗ trợ định vị"));
        return;
      }

      setIsGettingLocation(true);
      setLocationMethod("Đang định vị...");

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = [latitude, longitude];

          setCurrentLocation(location);
          setIsGettingLocation(false);
          setLocationMethod("GPS");

          if (mapRef.current) {
            mapRef.current.setView(location, 16);
          }

          const address = await reverseGeocode(latitude, longitude);
          if (address) {
            toast.success(`Đã cập nhật vị trí: ${address.split(",")[0]}`);
          } else {
            toast.success(
              `Đã cập nhật vị trí: ${latitude.toFixed(6)}, ${longitude.toFixed(
                6
              )}`
            );
          }

          resolve(location);
        },
        (error) => {
          setIsGettingLocation(false);
          setLocationMethod("Thủ công");
          console.error("Geolocation error:", error);

          if (error.code === 1) {
            toast.error("Bị từ chối quyền truy cập vị trí");
          } else if (error.code === 2) {
            toast.error("Không thể lấy vị trí");
          } else {
            toast.error("Lỗi định vị, sử dụng vị trí mặc định");
          }

          resolve([10.846129, 106.668837]);
        },
        options
      );
    });
  };

  const getRoute = async (from, to, label = "") => {
    if (!from || !to) {
      toast.error("Không có điểm đi hoặc điểm đến");
      return null;
    }

    if (from[0] === to[0] && from[1] === to[1]) {
      toast.info("Bạn đang ở đúng vị trí");
      return {
        geometry: null,
        distance: "0.00",
        duration: 0,
        label: label,
      };
    }

    setLoadingRoute(true);
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`,
        { timeout: 10000 }
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const routeData = response.data.routes[0];
        const distanceKm = (routeData.distance / 1000).toFixed(2);
        const durationMin = Math.round(routeData.duration / 60);

        toast.success(
          `Đã tìm đường${
            label ? ` đến ${label}` : ""
          }: ${distanceKm}km, ${durationMin} phút`
        );

        return {
          geometry: routeData.geometry,
          distance: distanceKm,
          duration: durationMin,
          label: label,
        };
      } else {
        toast.error("Không tìm thấy đường đi");
        return null;
      }
    } catch (error) {
      console.error("Lỗi tìm đường OSRM:", error);
      y;
      const distance = calculateAccurateDistance(
        from[0],
        from[1],
        to[0],
        to[1]
      );
      const duration = calculateEstimatedTime(distance);

      toast.info(
        `Sử dụng khoảng cách tạm tính${
          label ? ` đến ${label}` : ""
        }: ${distance.toFixed(2)}km, ${duration} phút`
      );

      return {
        geometry: {
          coordinates: [
            [from[1], from[0]],
            [to[1], to[0]],
          ],
          type: "LineString",
        },
        distance: distance.toFixed(2),
        duration: duration,
        label: label,
      };
    } finally {
      setLoadingRoute(false);
    }
  };

  const acceptOrder = async (order) => {
    if (!isOnline) {
      toast.error("Vui lòng bật trạng thái hoạt động");
      return;
    }

    if (currentOrder) {
      toast.error("Bạn đang có đơn hàng chưa hoàn thành");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/cap-nhat-trang-thai",
        method: "post",
        data: {
          orderId: order.orderId,
          status: "shipping",
        },
      });

      if (response.data.success) {
        const updatedOrders = orders.filter((o) => o.orderId !== order.orderId);
        setOrders(updatedOrders);

        const fullOrder = {
          ...order,
          status: "delivering",
          pickupTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setCurrentOrder(fullOrder);
        setDeliveryStatus("to_pickup");

        const routeToStore = await getRoute(
          currentLocation,
          fullOrder.storePosition,
          "cửa hàng"
        );

        if (routeToStore) {
          setRoute(routeToStore);

          if (mapRef.current) {
            const bounds = L.latLngBounds([
              currentLocation,
              fullOrder.storePosition,
            ]);
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
          }
        }

        toast.success(`Đã nhận đơn ${fullOrder.orderId}`);
      }
    } catch (error) {
      toast.error("Không thể nhận đơn");
      console.error("Error accepting order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const arriveAtStore = async () => {
    if (!currentOrder) return;

    setDeliveryStatus("arrived_store");
    toast.success(`Đã đến ${currentOrder.storeName}`);
  };

  const pickUpOrder = async () => {
    if (!currentOrder) return;

    setDeliveryStatus("picking_up");
    toast.success("Đang lấy hàng...");

    setTimeout(async () => {
      setDeliveryStatus("to_delivery");

      const routeToCustomer = await getRoute(
        currentOrder.storePosition,
        currentOrder.customerPosition,
        "khách hàng"
      );

      if (routeToCustomer) {
        setRoute(routeToCustomer);

        if (mapRef.current) {
          const bounds = L.latLngBounds([
            currentOrder.storePosition,
            currentOrder.customerPosition,
          ]);
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        toast.success(
          `Đã lấy hàng, bắt đầu giao đến khách! ${routeToCustomer.distance}km, ${routeToCustomer.duration} phút`
        );
      }
    }, 2000);
  };

  const startDelivery = async () => {
    if (!currentOrder) return;

    setDeliveryStatus("to_delivery");
    const routeToCustomer = await getRoute(
      currentLocation,
      currentOrder.customerPosition,
      "khách hàng"
    );

    if (routeToCustomer) {
      setRoute(routeToCustomer);

      if (mapRef.current) {
        const bounds = L.latLngBounds([
          currentLocation,
          currentOrder.customerPosition,
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }

      toast.success(
        `Bắt đầu giao đơn ${currentOrder.orderId}: ${routeToCustomer.distance}km, ${routeToCustomer.duration} phút`
      );
    }
  };

  const arriveAtCustomer = async () => {
    if (!currentOrder) return;

    setDeliveryStatus("arrived_customer");
    toast.success(`Đã đến nơi giao hàng cho ${currentOrder.customer}`);
  };

  const completeDelivery = async () => {
    if (!currentOrder) return;

    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/cap-nhat-trang-thai",
        method: "post",
        data: {
          orderId: currentOrder.orderId,
          status: "delivered",
        },
      });

      if (response.data.success) {
        const earnings = currentOrder.amount;

        const newTodayStats = {
          totalOrders: shipperStats.today.totalOrders + 1,
          totalEarnings: shipperStats.today.totalEarnings + earnings,
          orders: [
            ...(shipperStats.today.orders || []),
            {
              orderId: currentOrder.orderId,
              deliveredAt: new Date(),
              amount: earnings,
            },
          ],
        };

        const newAllTimeStats = {
          totalOrders: shipperStats.allTime.totalOrders + 1,
          totalEarnings: shipperStats.allTime.totalEarnings + earnings,
          averageEarnings:
            (shipperStats.allTime.totalEarnings + earnings) /
            (shipperStats.allTime.totalOrders + 1),
        };

        setShipperStats((prev) => ({
          ...prev,
          today: newTodayStats,
          allTime: newAllTimeStats,
        }));

        const completedOrder = {
          ...currentOrder,
          status: "delivered",
          deliveryTime: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setDeliveredOrders((prev) => [completedOrder, ...prev]);

        setTimeout(() => {
          fetchShipperStats();
        }, 1000);

        setDeliveryStatus("delivered");
        setRoute(null);

        toast.success(
          <div>
            <p className="font-medium">Giao hàng thành công!</p>
            <div className="text-sm mt-1">
              <p>
                Thu nhập:{" "}
                <span className="font-bold">{DisplayPriceInVND(earnings)}</span>
              </p>
              <p className="mt-1">
                Tổng hôm nay:{" "}
                <span className="font-bold">
                  {DisplayPriceInVND(newTodayStats.totalEarnings)}
                </span>
              </p>
              {/* <p className="mt-1">
                Tổng tất cả:{" "}
                <span className="font-bold">
                  {DisplayPriceInVND(newAllTimeStats.totalEarnings)}
                </span>
              </p> */}
            </div>
          </div>,
          { duration: 4000 }
        );

        setTimeout(() => {
          setCurrentOrder(null);
          setDeliveryStatus("idle");
        }, 3000);
      }
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
      console.error("Error completing delivery:", error);
    }
  };

  const cancelOrder = async (reason = "Tài xế hủy") => {
    if (!currentOrder) return;

    try {
      const response = await Axios({
        url: "/api/v1/nhan-vien-giao-hang/cap-nhat-trang-thai",
        method: "post",
        data: {
          orderId: currentOrder.orderId,
          status: "pending",
        },
      });

      if (response.data.success) {
        const orderToRestore = {
          ...currentOrder,
          status: "available",
        };
        setOrders((prev) => [...prev, orderToRestore]);

        setCurrentOrder(null);
        setDeliveryStatus("idle");
        setRoute(null);

        toast.error(`Đã hủy đơn ${currentOrder.orderId}`, { duration: 3000 });
      }
    } catch (error) {
      toast.error("Không thể hủy đơn");
    }
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    if (newStatus) {
      toast.success("Đã bắt đầu làm việc!", { duration: 2000 });
      getCurrentLocation();
      fetchOrders();
      fetchShipperStats();
    } else {
      toast.info("Đã tạm nghỉ", { duration: 2000 });
      if (currentOrder) {
        cancelOrder("Tài xế tạm nghỉ");
      }
    }
  };

  const viewDirections = async (from, to, label) => {
    const route = await getRoute(from, to, label);
    if (route) {
      setRoute(route);
      if (mapRef.current) {
        const bounds = L.latLngBounds([
          [from[0], from[1]],
          [to[0], to[1]],
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
      toast.success(
        `Chỉ đường đến ${label}: ${route.distance}km, ${route.duration} phút`
      );
    }
  };

  const MapController = () => {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;
      if (!mapInitialized) {
        setMapInitialized(true);
        map.setView([10.8231, 106.6297], 12);
      }
    }, [map, mapInitialized]);

    return null;
  };

  const convertGeoJsonToLatLng = (geometry) => {
    if (!geometry || !geometry.coordinates) return [];

    if (geometry.type === "LineString") {
      return geometry.coordinates.map((coord) => [coord[1], coord[0]]);
    }

    if (geometry.type === "MultiLineString") {
      return geometry.coordinates.flat().map((coord) => [coord[1], coord[0]]);
    }

    return [];
  };

  const DeliveryProgress = () => {
    if (!currentOrder) return null;

    const steps = [
      {
        id: 1,
        title: "Nhận đơn",
        icon: <MdPhoneIphone className="w-5 h-5" />,
        status: "to_pickup",
        action: null,
      },
      {
        id: 2,
        title: "Đến cửa hàng",
        icon: <MdLocalPizza className="w-5 h-5" />,
        status: "arrived_store",
        action: arriveAtStore,
      },
      {
        id: 3,
        title: "Lấy hàng",
        icon: <MdInventory className="w-5 h-5" />,
        status: "picking_up",
        action: pickUpOrder,
      },
      {
        id: 4,
        title: "Giao hàng",
        icon: <MdLocalShipping className="w-5 h-5" />,
        status: "to_delivery",
        action: startDelivery,
      },
      {
        id: 5,
        title: "Đến nơi",
        icon: <MdLocationOn className="w-5 h-5" />,
        status: "arrived_customer",
        action: arriveAtCustomer,
      },
      {
        id: 6,
        title: "Hoàn thành",
        icon: <MdCheckCircle className="w-5 h-5" />,
        status: "delivered",
        action: completeDelivery,
      },
    ];

    const currentStepIndex = steps.findIndex(
      (step) =>
        deliveryStatus === step.status ||
        (deliveryStatus === "idle" && step.id === 1)
    );

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MdDeliveryDining className="w-5 h-5 text-blue-500" />
          Đang giao đơn: {currentOrder.orderId}
        </h3>

        <div className="relative mb-6">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200"></div>
          <div
            className="absolute top-5 left-0 h-1 bg-blue-500 transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          ></div>
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isActive = step.id <= currentStepIndex + 1;
              const isCurrent = deliveryStatus === step.status;

              return (
                <div key={step.id} className="flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-2 transition-all duration-300 ${
                      isActive
                        ? isCurrent
                          ? "bg-green-500 text-white shadow-lg"
                          : "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isActive
                        ? isCurrent
                          ? "text-green-600 font-bold"
                          : "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {deliveryStatus === "to_pickup" && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MdStorefront className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium">
                    Đang đi đến cửa hàng
                  </p>
                  <p className="text-blue-700 text-sm">
                    {currentOrder.storeName}
                  </p>
                  <p className="text-blue-600 text-xs">
                    {currentOrder.storeAddress}
                  </p>
                </div>
              </div>
              {route && (
                <div className="mb-3 p-2 bg-white rounded border border-blue-200">
                  <p className="text-blue-700 text-sm">
                    Khoảng cách:{" "}
                    <span className="font-bold">{route.distance}km</span> • Thời
                    gian:{" "}
                    <span className="font-bold">{route.duration} phút</span>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <button
                  onClick={arriveAtStore}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MdCheckCircle className="w-5 h-5" />
                  Tôi đã đến cửa hàng
                </button>
                <button
                  onClick={() =>
                    viewDirections(
                      currentLocation,
                      currentOrder.storePosition,
                      "cửa hàng"
                    )
                  }
                  className="w-full px-4 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <MdDirections className="w-4 h-4" />
                  Xem chỉ đường
                </button>
              </div>
            </div>
          )}

          {deliveryStatus === "arrived_store" && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <MdStore className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-yellow-800 font-medium">Đã đến cửa hàng</p>
                  <p className="text-yellow-700 text-sm">
                    {currentOrder.storeName}
                  </p>
                  <p className="text-yellow-600 text-xs">
                    Vui lòng lấy hàng và xác nhận
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={pickUpOrder}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MdArrowForward className="w-5 h-5" />
                  Đã lấy hàng - Bắt đầu giao
                </button>
                <button
                  onClick={() => cancelOrder("Không lấy được hàng")}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <MdCancel className="w-4 h-4" />
                  Hủy đơn hàng
                </button>
              </div>
            </div>
          )}

          {deliveryStatus === "picking_up" && (
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p className="text-orange-800 font-medium">Đang lấy hàng...</p>
              </div>
            </div>
          )}

          {deliveryStatus === "to_delivery" && (
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MdDirectionsBike className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-purple-800 font-medium">Đang giao hàng</p>
                  <p className="text-purple-700 text-sm">
                    Giao đến: {currentOrder.customerAddress}
                  </p>
                  {route && (
                    <p className="text-purple-600 text-xs">
                      Còn khoảng: {route.distance}km • {route.duration} phút
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={arriveAtCustomer}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MdLocationPin className="w-5 h-5" />
                  Tôi đã đến nơi giao
                </button>
                <button
                  onClick={() =>
                    viewDirections(
                      currentLocation,
                      currentOrder.customerPosition,
                      "nơi giao"
                    )
                  }
                  className="w-full px-4 py-2 border border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <MdDirections className="w-4 h-4" />
                  Xem chỉ đường
                </button>
              </div>
            </div>
          )}

          {deliveryStatus === "arrived_customer" && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MdLocationPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-green-800 font-medium">
                    Đã đến nơi giao hàng
                  </p>
                  <p className="text-green-700 text-sm">
                    {currentOrder.customerAddress}
                  </p>
                  <p className="text-green-600 text-xs">
                    Khách hàng: {currentOrder.customer}
                  </p>
                  <p className="text-green-600 text-xs">
                    Số điện thoại: {currentOrder.customerPhone}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => callShipper(currentOrder.shipperPhone)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MdPhone className="w-5 h-5" />
                  Gọi khách hàng
                </button>

                <button
                  onClick={completeDelivery}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <MdCheckCircle className="w-5 h-5" />
                  Hoàn thành giao hàng
                </button>
                <button
                  onClick={() => cancelOrder("Khách không nhận hàng")}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <MdCancel className="w-4 h-4" />
                  Khách không nhận hàng
                </button>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Chi tiết đơn hàng
            </h4>
            {currentOrder.products &&
              currentOrder.products.map((product, index) => (
                <div key={index} className="mb-3">
                  <p className="font-medium text-gray-800">
                    {product.product_details?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số lượng: {product.quantity}
                  </p>
                  {product.sizes && product.sizes.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Size: {product.sizes[0].name} (+
                      {DisplayPriceInVND(product.sizes[0].price)})
                    </p>
                  )}
                  {product.bases && product.bases.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Đế: {product.bases[0].name} (+
                      {DisplayPriceInVND(product.bases[0].price)})
                    </p>
                  )}
                  <p className="text-sm font-medium text-orange-600 mt-1">
                    Tổng: {DisplayPriceInVND(product.totalAmt || 0)}
                  </p>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div>
              <span className="text-sm text-gray-600">Khách: </span>
              <span className="text-sm font-medium">
                {currentOrder.customer}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-orange-700">
                Tổng cộng: {DisplayPriceInVND(currentOrder.amount)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderCard = ({ order, isDelivered = false }) => {
    const isAvailable = order.status === "available";
    const isDelivering = order.status === "delivering";
    const isCurrentOrder = currentOrder?.orderId === order.orderId;

    const storeAddress = order.storeAddress || "Chi nhánh Gò Vấp";

    let displayCustomerAddress = order.customerAddress || "Đang cập nhật";
    if (displayCustomerAddress === ",") {
      displayCustomerAddress = "Đang cập nhật";
    }

    const displayCustomer = order.customer || "Khách hàng";

    const displayPhone = order.customerPhone || "";

    const displayAmount =
      order.amount > 0 ? DisplayPriceInVND(order.amount) : "99.0000₫";

    return (
      <div
        className={`p-4 hover:bg-gray-50 transition-colors ${
          isCurrentOrder ? "bg-blue-50 border-l-4 border-blue-500" : ""
        } ${isDelivered ? "bg-green-50" : ""}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{order.orderId}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isDelivered
                    ? "bg-green-100 text-green-800"
                    : isAvailable
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isDelivered
                  ? "Đã giao"
                  : isAvailable
                  ? "Sẵn sàng"
                  : "Đang giao"}
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.orderTime}</p>
            {order.deliveryTime && (
              <p className="text-xs text-green-600">
                Giao: {order.deliveryTime}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-orange-600">{displayAmount}</p>
            {/* <p className="text-xs text-gray-500">{order.distance}</p>
            <p className="text-xs text-blue-500">
              {order.estimatedDeliveryTime}
            </p> */}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MdPersonPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{displayCustomer}</p>
              {displayPhone && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MdPhone className="w-3 h-3" />
                  {displayPhone}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex items-start gap-2">
              <MdStore className="w-4 h-4 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Lấy tại:</p>
                <p className="text-gray-600 text-xs">{storeAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MdLocationPin className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Giao đến:</p>
                <p className="text-gray-600 text-xs">
                  {displayCustomerAddress}
                </p>
              </div>
            </div>
          </div>

          {order.products && order.products.length > 0 && (
            <div className="mb-3 p-2 bg-gray-50 rounded">
              {order.products.slice(0, 2).map((product, idx) => (
                <div key={idx} className="text-xs text-gray-600 mb-1">
                  {product.product_details?.name || "Sản phẩm"} x
                  {product.quantity}
                  {product.sizes && product.sizes.length > 0 && (
                    <span className="ml-2 text-gray-500">
                      [Size: {product.sizes[0].name}]
                    </span>
                  )}
                  {product.bases && product.bases.length > 0 && (
                    <span className="ml-2 text-gray-500">
                      [Đế: {product.bases[0].name}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {isAvailable && !isDelivered && (
            <button
              onClick={() => acceptOrder(order)}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <MdCheckCircle className="w-4 h-4" />
                  Nhận đơn này
                </>
              )}
            </button>
          )}

          {isCurrentOrder && !isDelivered && (
            <button
              onClick={() => cancelOrder("Tài xế hủy")}
              className="w-full px-4 py-2 mt-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2"
            >
              <MdCancel className="w-4 h-4" />
              Hủy đơn hàng này
            </button>
          )}
        </div>
      </div>
    );
  };

  const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getFilteredOrders = () => {
    if (activeTab === "available") {
      return orders.filter((order) => order.status === "available");
    } else if (activeTab === "active") {
      return currentOrder ? [currentOrder] : [];
    } else if (activeTab === "history") {
      return deliveredOrders;
    }
    return [];
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <MdClose className="w-6 h-6 text-gray-700" />
            ) : (
              <MdMenu className="w-6 h-6 text-gray-700" />
            )}
          </button> */}
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Pizza Shipper
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleOnlineStatus}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              isOnline
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-white animate-pulse" : "bg-gray-500"
              }`}
            ></div>
            {isOnline ? "Online" : "Offline"}
          </button>

          <button
            className="relative p-2.5 hover:bg-gray-100 rounded-lg"
            onClick={() => setOpenAvatarEdit(true)}
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
          {openAvatarEdit && (
            <ProfileDelivery close={() => setOpenAvatarEdit(false)} />
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 text-xs sm:text-sm"
          >
            <MdLogout className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:block font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isOnline
                    ? `Xin chào, ${userInfo?.name || "Shipper"}`
                    : "Xin chào!"}
                </h2>

                <p className="text-sm mt-1">
                  {isOnline ? (
                    <span className="text-gray-600">
                      Có{" "}
                      <span className="font-semibold text-green-600">
                        {orders.filter((o) => o.status === "available").length}
                      </span>{" "}
                      đơn hàng sẵn sàng
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Bật trạng thái hoạt động để bắt đầu nhận đơn
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation || isGeocoding}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 
                   hover:from-blue-600 hover:to-indigo-600 
                   text-white rounded-lg text-sm font-medium 
                   flex items-center justify-center gap-2 
                   disabled:opacity-50 transition"
                >
                  {isGettingLocation ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                      Đang định vị...
                    </>
                  ) : (
                    <>
                      <MdGpsFixed className="w-4 h-4" />
                      Cập nhật vị trí
                    </>
                  )}
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || isGettingLocation}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 
                   text-gray-700 rounded-lg text-sm font-medium 
                   flex items-center justify-center gap-2 
                   disabled:opacity-50 transition"
                  title="Làm mới dữ liệu"
                >
                  <MdRefresh
                    className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            <StatsCard
              title="Đã giao hôm nay"
              value={`${shipperStats.today.totalOrders} đơn`}
              icon={MdLocalShipping}
              color="bg-blue-500"
              subtitle={`Shipper: ${
                shipperStats.shipperName || userInfo?.name || "N/A"
              }`}
            />
            <StatsCard
              title="Thu nhập hôm nay"
              value={DisplayPriceInVND(shipperStats.today.totalEarnings)}
              icon={MdAttachMoney}
              color="bg-green-500"
              // subtitle={`Tổng tất cả: ${DisplayPriceInVND(
              //   shipperStats.allTime.totalEarnings
              // )}`}
            />
          </div>
        </div>

        {currentOrder && <DeliveryProgress />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Danh sách đơn hàng
                </h3>

                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("available")}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 ${
                      activeTab === "available"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Sẵn sàng (
                    {orders.filter((o) => o.status === "available").length})
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 ${
                      activeTab === "active"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Đang giao ({currentOrder ? 1 : 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`flex-1 px-3 py-2 text-sm font-medium border-b-2 ${
                      activeTab === "history"
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Đã giao ({deliveredOrders.length})
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto scrollBarCustom">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id || order.orderId}
                    order={order}
                    isDelivered={activeTab === "history"}
                  />
                ))}

                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeTab === "available" ? (
                        <MdShoppingBag className="w-8 h-8 text-gray-400" />
                      ) : activeTab === "active" ? (
                        <MdDeliveryDining className="w-8 h-8 text-gray-400" />
                      ) : (
                        <MdHistory className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <p className="text-gray-500 font-medium">
                      {activeTab === "available"
                        ? "Không có đơn hàng sẵn sàng"
                        : activeTab === "active"
                        ? "Không có đơn hàng đang giao"
                        : "Không có đơn hàng đã giao"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Hành động nhanh
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (mapRef.current) {
                      mapRef.current.setView(currentLocation, 16);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MdMyLocation className="w-4 h-4" />
                    Về vị trí hiện tại
                  </span>
                  <MdNavigateNext className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const availableOrders = orders.filter(
                      (o) => o.status === "available"
                    );
                    if (availableOrders.length > 0 && mapRef.current) {
                      mapRef.current.setView(
                        availableOrders[0].storePosition,
                        15
                      );
                    }
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 text-yellow-700 rounded-lg text-sm font-medium flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <MdStore className="w-4 h-4" />
                    Xem cửa hàng gần nhất
                  </span>
                  <MdNavigateNext className="w-4 h-4" />
                </button>
                {currentOrder && (
                  <button
                    onClick={() =>
                      viewDirections(
                        currentLocation,
                        currentOrder.customerPosition,
                        "khách hàng"
                      )
                    }
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 text-green-700 rounded-lg text-sm font-medium flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <MdDirections className="w-4 h-4" />
                      Chỉ đường hiện tại
                    </span>
                    <MdNavigateNext className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Bản đồ giao hàng
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentOrder
                        ? `Đang giao đơn ${currentOrder.orderId}`
                        : `${
                            orders.filter((o) => o.status === "available")
                              .length
                          } đơn sẵn sàng`}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="flex items-center gap-1">
                        {locationMethod === "GPS" ? (
                          <MdGpsFixed className="w-3 h-3 text-green-500" />
                        ) : (
                          <MdGpsNotFixed className="w-3 h-3 text-yellow-500" />
                        )}
                        {locationMethod}
                      </span>
                      <span className="text-gray-500">
                        {currentLocation[0].toFixed(6)},{" "}
                        {currentLocation[1].toFixed(6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => mapRef.current?.zoomIn()}
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Phóng to"
                      >
                        <MdZoomIn className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => mapRef.current?.zoomOut()}
                        className="p-1.5 hover:bg-gray-200 rounded"
                        title="Thu nhỏ"
                      >
                        <MdZoomOut className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative" style={{ height: "600px" }}>
                <MapContainer
                  center={currentLocation}
                  zoom={zoom}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                  whenCreated={(map) => {
                    mapRef.current = map;
                    setMapInitialized(true);
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {route && route.geometry && (
                    <Polyline
                      positions={convertGeoJsonToLatLng(route.geometry)}
                      color="#3b82f6"
                      weight={4}
                      opacity={0.8}
                    />
                  )}

                  <Marker position={currentLocation} icon={driverIcon}>
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="font-bold text-gray-900 mb-1">
                          Vị trí của bạn
                        </div>
                        <div className="text-sm text-gray-600">
                          {currentLocation[0].toFixed(6)},{" "}
                          {currentLocation[1].toFixed(6)}
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Nhân viên đang hoạt động
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {BRANCHES.map((branch) => (
                    <Marker
                      key={branch.id}
                      position={branch.position}
                      icon={storeIcon}
                    >
                      <Popup>
                        <div className="p-2 min-w-[250px]">
                          <div className="font-bold text-gray-900 mb-1">
                            {branch.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {branch.address}
                          </div>
                          <div className="text-xs text-blue-600">
                            Chi nhánh chính
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {orders
                    .filter((order) => order.status === "available")
                    .map((order) => (
                      <Marker
                        key={order._id || order.orderId}
                        position={order.customerPosition}
                        icon={availableOrderIcon}
                      >
                        <Popup>
                          <div className="p-2 min-w-[250px]">
                            <div className="font-bold text-gray-900 mb-1">
                              {order.orderId}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {order.customer}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {order.distance} • {order.estimatedDeliveryTime}
                            </div>
                            <div className="text-sm font-medium text-orange-600 mb-2">
                              {DisplayPriceInVND(order.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Lấy tại: {order.storeName}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                  {currentOrder && (
                    <>
                      <Marker
                        position={currentOrder.storePosition}
                        icon={storeIcon}
                      >
                        <Popup>
                          <div className="p-2 min-w-[250px]">
                            <div className="font-bold text-gray-900 mb-1">
                              {currentOrder.storeName}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {currentOrder.storeAddress}
                            </div>
                            <div className="text-xs text-blue-600">
                              Điểm lấy hàng
                            </div>
                          </div>
                        </Popup>
                      </Marker>

                      {/* Khách hàng */}
                      <Marker
                        position={currentOrder.customerPosition}
                        icon={customerIcon}
                      >
                        <Popup>
                          <div className="p-2 min-w-[300px]">
                            <div className="font-bold text-gray-900 mb-1">
                              {currentOrder.customer}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {currentOrder.customerPhone}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              {currentOrder.customerAddress}
                            </div>
                            <div className="text-sm font-medium text-orange-600">
                              Tổng đơn: {DisplayPriceInVND(currentOrder.amount)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {currentOrder.distance} từ cửa hàng
                            </div>
                          </div>
                        </Popup>
                      </Marker>

                      {route && (
                        <div className="leaflet-popup">
                          <div className="leaflet-popup-content">
                            <div className="p-2">
                              <div className="text-sm font-medium text-blue-600">
                                Đường đi hiện tại
                              </div>
                              <div className="text-xs text-gray-600">
                                {route.distance}km • {route.duration} phút
                                {route.label && ` đến ${route.label}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <MapController />
                  <ZoomControl position="bottomright" />
                </MapContainer>

                {(loadingRoute || isGeocoding) && (
                  <div className="absolute top-4 right-4 bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {loadingRoute
                          ? "Đang tìm đường..."
                          : "Đang xử lý vị trí..."}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 bg-white px-4 py-3 rounded-lg shadow-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Chú thích bản đồ:
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Shipper</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-600">Cửa hàng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Khách hàng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Đơn sẵn sàng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardDelivery;
