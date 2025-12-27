import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import fetchAdminDetails from "../utils/fetchAdminDetails";

const LoadingScreen = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex items-center space-x-3 text-red-500 text-xl font-semibold">
      <span className="animate-spin border-4 border-red-500 border-t-transparent rounded-full w-8 h-8"></span>
      <span>Đang tải dữ liệu Admin...</span>
    </div>
  </div>
);

const AdminAuthInitializer = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminAccessToken");

    if (!adminToken) {
      setIsAuthReady(true);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchAdminDetails(true); 
        const adminData = response?.data?.data;

        if (!adminData) {

          localStorage.removeItem("adminAccessToken");
          localStorage.removeItem("adminRefreshToken");
        }
      } catch (error) {

        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("adminRefreshToken");
      } finally {
        setIsAuthReady(true);
      }
    };

    fetchData();
  }, [dispatch]);

  if (!isAuthReady) return <LoadingScreen />;
  return children;
};

export default AdminAuthInitializer;
