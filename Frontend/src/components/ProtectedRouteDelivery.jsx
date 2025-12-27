import { Navigate } from "react-router-dom";

const ProtectedRouteDelivery = ({ children }) => {
  const deliveryToken = localStorage.getItem("deliveryAccessToken");

  if (!deliveryToken) {
    return <Navigate to="/nhan-vien-giao-hang/dang-nhap" replace />;
  }
  return children;   
};

export default ProtectedRouteDelivery;
