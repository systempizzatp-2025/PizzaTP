import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  addAddressController,
  deleteAddressController,
  getAddressController,
  updateAddressController,
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.post("/tao-dia-chi", auth, addAddressController);
addressRouter.get("/lay-dia-chi", auth, getAddressController);
addressRouter.put("/cap-nhat-dia-chi", auth, updateAddressController);
addressRouter.delete("/xoa-dia-chi", auth, deleteAddressController);

export default addressRouter;  
