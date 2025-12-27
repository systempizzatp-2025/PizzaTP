import { Router } from "express";
import uploadImageController from "../controllers/uploadimage.controller.js";
import upload from "../middleware/multer.js";
// import auth from "../middleware/auth.js";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("image"), uploadImageController);

export default uploadRouter;
