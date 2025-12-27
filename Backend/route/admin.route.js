import express from "express";
import {
  loginAdminController,
  logoutAdminController,
  getAdminDetailsController,
  refreshAccessTokenAdminController,
  getAllUsers,
  updateUserRole,
  deleteUser,
  createDeliveryAccountController,
  getPendingOrdersController, 
  getShippingOrdersController, 
  getDeliveredOrdersController,
  assignShipperController,
  cancelOrderController,
  confirmDeliveryController,
  getShippersController, 
} from "../controllers/admin.controller.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router.post("/dang-nhap", loginAdminController);
router.get("/dang-xuat", logoutAdminController);
router.get("/thong-tin-quan-tri-vien", authAdmin, getAdminDetailsController);
router.post("/lam-moi-token", refreshAccessTokenAdminController);

router.get("/users", authAdmin, getAllUsers);
router.patch("/users/:userId/role", authAdmin, updateUserRole);
router.delete("/users/:userId", authAdmin, deleteUser);
router.post("/create-delivery", authAdmin, createDeliveryAccountController);


router.get("/don-cho-giao", authAdmin, getPendingOrdersController);
router.get("/don-dang-giao", authAdmin, getShippingOrdersController);
router.get("/don-da-giao", authAdmin, getDeliveredOrdersController);

router.post("/phan-cong-shipper/:orderId", authAdmin, assignShipperController);
router.post("/huy-don-hang/:orderId", authAdmin, cancelOrderController);
router.post(
  "/xac-nhan-giao-hang/:orderId",
  authAdmin,
  confirmDeliveryController
);


router.get("/shippers", authAdmin, getShippersController);

export default router;
