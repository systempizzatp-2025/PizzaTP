import { Router } from "express";
import {
  AddCategoryController,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import authAdmin from "../middleware/authAdmin.js";
const categoryRouter = Router();

categoryRouter.post("/them-danh-muc-chinh", authAdmin, AddCategoryController);
categoryRouter.get("/lay-danh-muc-chinh", getCategoryController);
categoryRouter.put(
  "/cap-nhat-danh-muc-chinh",
  authAdmin,
  updateCategoryController
);
categoryRouter.delete(
  "/xoa-danh-muc-chinh",
  authAdmin,
  deleteCategoryController
);
export default categoryRouter;
