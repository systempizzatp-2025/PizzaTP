import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  const adminToken = localStorage.getItem("adminAccessToken");

  if (!adminToken) {
    return <Navigate to="/quan-tri-vien/dang-nhap" replace />;
  }

  return children;
};

export default ProtectedRouteAdmin;
