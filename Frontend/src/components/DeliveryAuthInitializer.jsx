import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import fetchDeliveryDetails from "../utils/fetchDeliveryDetails";

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex items-center space-x-3 text-red-500 text-xl font-semibold">
      <span className="animate-spin border-4 border-red-500 border-t-transparent rounded-full w-8 h-8"></span>
      <span>Đang tải dữ liệu Delivery...</span>
    </div>
  </div>
);

const DeliveryAuthInitializer = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const deliveryToken = localStorage.getItem("deliveryAccessToken");

    if (!deliveryToken) {
      setIsAuthReady(true);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchDeliveryDetails(true);
        const deliveryData = response?.data?.data;

        if (!deliveryData) {
          localStorage.removeItem("deliveryAccessToken");
          localStorage.removeItem("deliveryRefreshToken");
        }
      } catch (error) {
        localStorage.removeItem("deliveryAccessToken");
        localStorage.removeItem("deliveryRefreshToken");
      } finally {
        setIsAuthReady(true);
      }
    };

    fetchData();
  }, [dispatch]);

  if (!isAuthReady) return <LoadingScreen />;
  return children;
};

export default DeliveryAuthInitializer;
