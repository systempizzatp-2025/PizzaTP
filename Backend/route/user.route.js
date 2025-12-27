import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshToken,
  registerUserController,
  resetPassword,
  updateUserDetails,
  uploadImage,
  userDetails,
  verifyEmailController,
  verifyForgotPasswordOtp,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/dang-ky", registerUserController);
userRouter.get("/xac-thuc-email", verifyEmailController); //post
userRouter.post("/dang-nhap", loginController);
userRouter.get("/dang-xuat", auth, logoutController);
userRouter.put("/upload-image", auth, upload.single("img"), uploadImage);
userRouter.put("/cap-nhat-thong-tin-nguoi-dung", auth, updateUserDetails);
userRouter.put("/quen-mat-khau", forgotPasswordController);
userRouter.put("/xac-thuc-quen-mat-khau-otp", verifyForgotPasswordOtp);
userRouter.put("/dat-lai-mat-khau", resetPassword);
userRouter.post("/lam-moi-token", refreshToken);
userRouter.get("/thong-tin-nguoi-dung", auth, userDetails);

export default userRouter;
