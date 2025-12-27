import { Router } from "express";

import {
  createProductController,
  deleteProductDetailsController,
  getProductByCategory,
  getProductByCategoryAndSubcategory,
  getProductController,
  getProductDetailsController,
  relatedProducts,
  searchProduct,
  updateProductDetailesController,
} from "../controllers/product.controller.js";
import authAdmin from "../middleware/authAdmin.js";

const productRouter = Router();

productRouter.post("/tao-san-pham", authAdmin, createProductController);
productRouter.post("/lay-san-pham", getProductController);
productRouter.post("/lay-san-pham-boi-danh-muc-chinh", getProductByCategory);
productRouter.post(
  "/lay-san-pham-boi-danh-muc-chinh-va-danh-muc-phu",
  getProductByCategoryAndSubcategory
);
productRouter.post("/lay-thong-tin-san-pham", getProductDetailsController);



productRouter.put(
  "/cap-nhat-thong-tin-san-pham",
  authAdmin,
  updateProductDetailesController
);


productRouter.delete(
  "/xoa-san-pham",
  authAdmin,
  deleteProductDetailsController
);


productRouter.post("/tim-kiem-san-pham", searchProduct);


productRouter.post("/san-pham-tuong-tu", relatedProducts);
export default productRouter;
