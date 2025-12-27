import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SearchPage from "../pages/SearchPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import DashboardUser from "../layouts/DashboardUser";
import ProfileUser from "../pages/MenuItemUser/ProfileUser";
import DashboardAdmin from "../layouts/DashboardAdmin";
import OrdersUser from "../pages/MenuItemUser/OrdersUser";
import FavoriteProductsUser from "../pages/MenuItemUser/FavoriteProductsUser";
import AddressUser from "../pages/MenuItemUser/AddressUser";
// import AllOrders from "../pages/MenuItemAdmin/Orders Management/AllOrders";
// import OrderTracking from "../pages/MenuItemUser/OrderTracking";
// import PendingOrders from "../pages/MenuItemAdmin/Orders Management/PendingOrders";
// import DeliveringOrders from "../pages/MenuItemAdmin/Orders Management/DeliveringOrders";
// import DeliveredOrders from "../pages/MenuItemAdmin/Orders Management/DeliveredOrders";
import ProductList from "../pages/MenuItemAdmin/Product/ProductList";
import AddProduct from "../pages/MenuItemAdmin/Product/AddProduct";
import MainCategoryList from "../pages/MenuItemAdmin/Category Management/MainCategoryList";
import SubCategoryList from "../pages/MenuItemAdmin/Category Management/SubCategoryList";
import AllUsers from "../pages/MenuItemAdmin/User Management/AllUsers";
import PromotionList from "../pages/MenuItemAdmin/Promotion/PromotionList";
import CreatePromotion from "../pages/MenuItemAdmin/Promotion/CreatePromotion";
import NotificationHistory from "../pages/MenuItemAdmin/Notifications/NotificationHistory";
import SendNotification from "../pages/MenuItemAdmin/Notifications/SendNotification";
// import RevenueReport from "../pages/MenuItemAdmin/Reports & Analytics/RevenueReport";
import AllReviews from "../pages/MenuItemAdmin/Reviews/AllReviews";
// import ProtectedRoute from "../components/ProtectedRouteAdmin";
import LoginAdmin from "../pages/MenuItemAdmin/LoginAdmin";
import AdminAuthInitializer from "../components/AdminAuthInitializer";
// import ProtectedRouteUser from "../components/ProtectedRouteUser";
import ProductListPage from "../pages/ProductListPage";
import ProductDisplayPage from "../pages/ProductDisplayPage";
import CartItem from "../components/CartItem";
import CheckoutPage from "../pages/CheckoutPage";
import Success from "../pages/Success";
import Cancel from "../pages/Cancel";
// import NewsPage from "../pages/NewsHeader";
import NewsHeader from "../pages/NewsHeader";
import PromotionHeader from "../pages/PromotionHeader";
import MenuHeader from "../pages/MenuHeader";
import ServiceHeader from "../pages/ServiceHeader";
import IntroduceHeader from "../pages/IntroduceHeader";
import CategoryAllProductsPage from "../components/CategoryAllProductsPage";
import DashboardDelivery from "../layouts/DashboardDelivery";
import CustomerFeedback from "../pages/MenuItemAdmin/CustomerFeedback";
import OrdersAwaitingDelivery from "../pages/MenuItemAdmin/Orders/OrdersAwaitingDelivery";
import OrdersAreBeingDelivered from "../pages/MenuItemAdmin/Orders/OrdersAreBeingDelivered.JSX";
import TheOrderHasBeenDelivered from "../pages/MenuItemAdmin/Orders/TheOrderHasBeenDelivered";
import OrderTracking from "../pages/MenuItemUser/OrderTracking";
import ProtectedRouteAdmin from "../components/ProtectedRouteAdmin";
import DeliveryAuthInitializer from "../components/DeliveryAuthInitializer";
import ProtectedRouteDelivery from "../components/ProtectedRouteDelivery";
import LoginDelivery from "../pages/MenuItemDelivery/LoginDelivery";
import OrderSuccess from "../pages/OrderSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "tim-kiem",
        element: <SearchPage />,
      },
      {
        path: "dang-nhap",
        element: <Login />,
      },
      {
        path: "dang-ky",
        element: <Register />,
      },
      {
        path: "quen-mat-khau",
        element: <ForgotPassword />,
      },
      {
        path: "xac-thuc-otp",
        element: <OtpVerification />,
      },
      {
        path: "dat-lai-mat-khau",
        element: <ResetPassword />,
      },
      {
        path: "gio-hang",
        element: <CartItem />,
      },

      {
        path: "nguoi-dung/bang-dieu-khien",
        element: <DashboardUser />,
        children: [
          {
            path: "tai-khoan-cua-toi",
            element: <ProfileUser />,
          },
          {
            path: "theo-doi-don-hang",
            element: <OrderTracking />,
          },
          {
            path: "don-hang-da-dat",
            element: <OrdersUser />,
          },

          {
            path: "san-pham-yeu-thich",
            element: <FavoriteProductsUser />,
          },
          {
            path: "luu-dia-chi",
            element: <AddressUser />,
          },
        ],
      },
      {
        path: ":category",
        children: [
          {
            path: "tat-ca",
            element: <CategoryAllProductsPage />,
          },
          {
            path: ":subCategory",
            element: <ProductListPage />,
          },
        ],
      },
      {
        path: "san-pham/:product",
        element: <ProductDisplayPage />,
      },
      {
        path: "thanh-toan",
        element: <CheckoutPage />,
      },
      {
        path: "thanh-cong",
        element: <Success />,
      },
      {
        path: "that-bai",
        element: <Cancel />,
      },
      {
        path: "dat-hang-thanh-cong",
        element: <OrderSuccess />,
      },
      {
        path: "gioi-thieu",
        element: <IntroduceHeader />,
      },
      {
        path: "dich-vu",
        element: <ServiceHeader />,
      },
      {
        path: "thuc-don",
        element: <MenuHeader />,
      },
      {
        path: "ma-giam-gia",
        element: <PromotionHeader />,
      },
      {
        path: "tin-tuc",
        element: <NewsHeader />,
      },
    ],
  },

  {
    path: "quan-tri-vien/bang-dieu-khien",

    element: (
      <AdminAuthInitializer>
        <ProtectedRouteAdmin>
          <DashboardAdmin />
        </ProtectedRouteAdmin>
      </AdminAuthInitializer>
    ),
    children: [
      {
        path: "phan-hoi-khach-hang",
        element: <CustomerFeedback />,
      },
      {
        path: "don-hang-cho-giao",
        element: <OrdersAwaitingDelivery />,
      },
      {
        path: "don-hang-dang-giao",
        element: <OrdersAreBeingDelivered />,
      },
      {
        path: "don-hang-da-giao",
        element: <TheOrderHasBeenDelivered />,
      },
      {
        path: "danh-sach-san-pham",
        element: <ProductList />,
      },
      {
        path: "them-san-pham-moi",
        element: <AddProduct />,
      },
      {
        path: "danh-muc-chinh",
        element: <MainCategoryList />,
      },
      {
        path: "danh-muc-phu",
        element: <SubCategoryList />,
      },
      {
        path: "tat-ca-nguoi-dung",
        element: <AllUsers />,
      },
      {
        path: "danh-sach-ma-giam-gia",
        element: <PromotionList />,
      },
      {
        path: "tao-ma-giam-gia",
        element: <CreatePromotion />,
      },
      {
        path: "tat-ca-danh-gia",
        element: <AllReviews />,
      },
      {
        path: "gui-thong-bao",
        element: <SendNotification />,
      },
      {
        path: "lich-su-thong-bao",
        element: <NotificationHistory />,
      },
    ],
  },
  {
    path: "quan-tri-vien/dang-nhap",
    element: <LoginAdmin />,
  },
  {
    path: "nhan-vien-giao-hang/bang-dieu-khien",
    element: (
      <DeliveryAuthInitializer>
        <ProtectedRouteDelivery>
          <DashboardDelivery />
        </ProtectedRouteDelivery>
      </DeliveryAuthInitializer>
    ),
  },
  {
    path: "nhan-vien-giao-hang/dang-nhap",
    element: <LoginDelivery />,
  },
]);

export default router;
