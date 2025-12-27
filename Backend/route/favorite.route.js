import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../controllers/favorite.controller.js";

const favoriteRouter = Router();


favoriteRouter.post("/san-pham-yeu-thich", auth, addFavorite);


favoriteRouter.delete("/xoa-san-pham-yeu-thich/:productId", auth, removeFavorite);


favoriteRouter.get("/lay-san-pham-yeu-thich", auth, getUserFavorites);

export default favoriteRouter;
