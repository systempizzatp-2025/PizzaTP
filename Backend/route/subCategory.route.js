import { Router } from "express";
import authAdmin from "../middleware/authAdmin.js";
import {
  AddSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";

const subCategoryRouter = Router();

subCategoryRouter.post(
  "/tao-danh-muc-phu",
  authAdmin,
  AddSubCategoryController
);
subCategoryRouter.post("/lay-danh-muc-phu", getSubCategoryController);
subCategoryRouter.put(
  "/cap-nhat-danh-muc-phu",
  authAdmin,
  updateSubCategoryController
);
subCategoryRouter.delete(
  "/xoa-danh-muc-phu",
  authAdmin,
  deleteSubCategoryController
);

export default subCategoryRouter;
