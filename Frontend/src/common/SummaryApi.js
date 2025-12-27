export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  register: {
    url: "api/v1/nguoi-dung/dang-ky",
    method: "post",
  },
  login: {
    url: "api/v1/nguoi-dung/dang-nhap",
    method: "post",
  },
  forgot_password: {
    url: "api/v1/nguoi-dung/quen-mat-khau",
    method: "put",
  },
  forgot_password_otp_verification: {
    url: "api/v1/nguoi-dung/xac-thuc-quen-mat-khau-otp",
    method: "put",
  },
  reset_password: {
    url: "api/v1/nguoi-dung/dat-lai-mat-khau",
    method: "put",
  },
  refreshToken: {
    url: "api/v1/nguoi-dung/lam-moi-token",
    method: "post",
  },
  userDetails: {
    url: "api/v1/nguoi-dung/thong-tin-nguoi-dung",
    method: "get",
  },
  logout: {
    url: "api/v1/nguoi-dung/dang-xuat",
    method: "get",
  },

  uploadProfile: {
    url: "api/v1/nguoi-dung/upload-image",
    method: "put",
  },
  updateUserDetails: {
    url: "api/v1/nguoi-dung/cap-nhat-thong-tin-nguoi-dung",
    method: "put",
  },

  addcategory: {
    url: "api/v1/danh-muc-chinh/them-danh-muc-chinh",
    method: "post",
  },
  uploadImage: {
    url: "api/v1/file/upload",
    method: "post",
  },
  getCategory: {
    url: "api/v1/danh-muc-chinh/lay-danh-muc-chinh",
    method: "get",
  },
  updateCategory: {
    url: "api/v1/danh-muc-chinh/cap-nhat-danh-muc-chinh",
    method: "put",
  },
  deleteCategory: {
    url: "api/v1/danh-muc-chinh/xoa-danh-muc-chinh",
    method: "delete",
  },
  // ADMIN
  loginAdmin: {
    url: "api/v1/quan-tri-vien/dang-nhap",
    method: "post",
  },
  logoutAdmin: {
    url: "api/v1/quan-tri-vien/dang-xuat",
    method: "get",
  },
  userDetailsAdmin: {
    url: "api/v1/quan-tri-vien/thong-tin-quan-tri-vien",
    method: "get",
  },
  refreshTokenAdmin: {
    url: "api/v1/quan-tri-vien/lam-moi-token",
    method: "post",
  },
  create_delivery: {
    url: "api/v1/quan-tri-vien/create-delivery",
    method: "post",
  },

  // Delivery
  loginDelivery: {
    url: "api/v1/nhan-vien-giao-hang/dang-nhap",
    method: "post",
  },
  logoutDelivery: {
    url: "api/v1/nhan-vien-giao-hang/dang-xuat",
    method: "get",
  },
  userDetailsDelivery: {
    url: "api/v1/nhan-vien-giao-hang/thong-tin-nhan-vien-giao-hang",
    method: "get",
  },
  refreshTokenDelivery: {
    url: "api/v1/nhan-vien-giao-hang/lam-moi-token",
    method: "post",
  },
  uploadDeliveryProfile: {
    url: "api/v1/nhan-vien-giao-hang/upload-image",
    method: "put",
  },
  updateDeliveryDetails: {
    url: "api/v1/nhan-vien-giao-hang/cap-nhat-thong-tin",
    method: "put",
  },
  createSubcategory: {
    url: "api/v1/danh-muc-phu/tao-danh-muc-phu",
    method: "post",
  },
  getSubCategory: {
    url: "api/v1/danh-muc-phu/lay-danh-muc-phu",
    method: "post",
  },
  updateSubCategory: {
    url: "api/v1/danh-muc-phu/cap-nhat-danh-muc-phu",
    method: "put",
  },
  deleteSubCategory: {
    url: "api/v1/danh-muc-phu/xoa-danh-muc-phu",
    method: "delete",
  },
  createProduct: {
    url: "api/v1/san-pham/tao-san-pham",
    method: "post",
  },
  getProduct: {
    url: "api/v1/san-pham/lay-san-pham",
    method: "post",
  },
  getProductByCategory: {
    url: "api/v1/san-pham/lay-san-pham-boi-danh-muc-chinh",
    method: "post",
  },
  getProductByCategoryAndSubCategory: {
    url: "api/v1/san-pham/lay-san-pham-boi-danh-muc-chinh-va-danh-muc-phu",
    method: "post",
  },
  getProductDetails: {
    url: "api/v1/san-pham/lay-thong-tin-san-pham",
    method: "post",
  },
  updateProductDetails: {
    url: "api/v1/san-pham/cap-nhat-thong-tin-san-pham",
    method: "put",
  },
  deleteProduct: {
    url: "api/v1/san-pham/xoa-san-pham",
    method: "delete",
  },
  searchProduct: {
    url: "api/v1/san-pham/tim-kiem-san-pham",
    method: "post",
  },
  relatedProducts: {
    url: "api/v1/san-pham/san-pham-tuong-tu",
    method: "post",
  },
  addTocart: {
    url: "api/v1/gio-hang/tao-gio-hang",
    method: "post",
  },
  getCartItem: {
    url: "api/v1/gio-hang/lay-gio-hang",
    method: "get",
  },
  updateCartItemQty: {
    url: "api/v1/gio-hang/cap-nhat-so-luong-gio-hang",
    method: "put",
  },
  deleteCartItem: {
    url: "api/v1/gio-hang/xoa-san-pham-gio-hang",
    method: "delete",
  },
  addFavorite: {
    url: "api/v1/yeu-thich/san-pham-yeu-thich",
    method: "post",
  },
  getUserFavorites: {
    url: "api/v1/yeu-thich/lay-san-pham-yeu-thich",
    method: "get",
  },
  removeFavorite: {
    url: "api/v1/yeu-thich/xoa-san-pham-yeu-thich",
    method: "delete",
  },
  getAllUsers: {
    url: "api/v1/quan-tri-vien/tat-ca-nguoi-dung",
    method: "get",
  },
  updateUser: {
    url: "api/v1/quan-tri-vien/cap-nhat-nguoi-dung",
    method: "put",
  },
  createAddress: {
    url: "api/v1/dia-chi/tao-dia-chi",
    method: "post",
  },
  getAddress: {
    url: "api/v1/dia-chi/lay-dia-chi",
    method: "get",
  },
  updateAddress: {
    url: "api/v1/dia-chi/cap-nhat-dia-chi",
    method: "put",
  },
  disableAddress: {
    url: "api/v1/dia-chi/xoa-dia-chi",
    method: "delete",
  },
  CashOnDeliveryOrderController: {
    url: "api/v1/dat-hang/tien-mat-khi-giao-hang",
    method: "post",
  },
  payment_url: {
    url: "api/v1/dat-hang/thanh-toan-online",
    method: "post",
  },
  getOrderItems: {
    url: "api/v1/dat-hang/lay-danh-sach-don-da-dat-hang",
    method: "get",
  },
  getReviews: {
    url: (productId) => `/api/reviews/${productId}`,
    method: "get",
  },

  addComment: {
    url: "/api/reviews",
    method: "post",
  },

  all_users: {
    url: "/api/v1/quan-tri-vien/users",
    method: "get",
  },

  update_role: (userId) => ({
    url: `/api/v1/quan-tri-vien/users/${userId}/role`,
    method: "patch",
  }),

  delete_user: (userId) => ({
    url: `/api/v1/quan-tri-vien/users/${userId}`,
    method: "delete",
  }),

  all_reviews: {
    url: "/api/reviews/admin/all",
    method: "get",
  },

  delete_review: (id) => ({
    url: `/api/reviews/admin/${id}`,
    method: "delete",
  }),

  create_promotion: {
    url: "/api/v1/promotion/create",
    method: "post",
  },
  listPromotion: {
    url: "/api/v1/promotion/list",
    method: "get",
  },
  validatePromotion: {
    url: "/api/v1/promotion/validate",
    method: "post",
  },
  redeemPromotion: {
    url: "/api/v1/promotion/redeem",
    method: "post",
  },
  //+ hủy đơn
  cancelOrder: {
    url: "/api/orders/cancel",
    method: "post",
  },
  notifications: {
    get_user: {
      url: "/api/notifications/user/my",
      method: "get",
    },
    mark_read: {
      url: "/api/notifications/user/read",
      method: "put",
    },
    admin_all: {
      url: "/api/notifications/admin/all",
      method: "get",
    },
    admin_delete: {
      url: "/api/notifications/admin",
      method: "delete",
    },
    admin_create_global: {
      url: "/api/notifications/admin/create-global",
      method: "post",
    },
  },
  chat: {
    conversations: {
      url: "/api/admin/conversations",
      method: "get",
    },
    getMessages: (conversationId) => ({
      url: `/api/messages/${conversationId}`,
      method: "get",
    }),
    sendMessage: {
      url: "/api/send",
      method: "post",
    },
    markRead: {
      url: "/api/mark-read",
      method: "put",
    },
    getUsersWithoutChat: {
      url: "/api/admin/users-without-chat",
      method: "get",
    },
  },
};
export default SummaryApi;
