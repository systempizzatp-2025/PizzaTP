import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addToCartItemController,
  deleteCartItemQtyController,
  getCartItemController,
  updateCartItemQtyController,
} from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/tao-gio-hang", auth, addToCartItemController);
cartRouter.get("/lay-gio-hang", auth, getCartItemController);
cartRouter.put(
  "/cap-nhat-so-luong-gio-hang",
  auth,
  updateCartItemQtyController
);

cartRouter.delete("/xoa-san-pham-gio-hang", auth, deleteCartItemQtyController)

export default cartRouter;
