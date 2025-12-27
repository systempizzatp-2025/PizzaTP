import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/user.model.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/genenratedRefreshToken.js";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
  try {
    const { tokenId } = req.body;

    if (!tokenId) {
      return res
        .status(400)
        .json({ success: false, message: "TokenId is required" });
    }


    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      console.error("Invalid Google token:", err);
      return res
        .status(400)
        .json({ success: false, message: "Google token không hợp lệ" });
    }

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Google account không cung cấp email",
        });
    }


    let user = await UserModel.findOne({ email });
    let isNewUser = false;

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        password: googleId + Date.now(),
        verify_email: true,
        status: "Active",
        profile_image: picture,
        google_id: googleId,
      });
      isNewUser = true;
    } else {
      user.google_id = googleId;
      user.profile_image = picture;
      await user.save();
    }


    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const cookieOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.cookie("accessToken", accessToken, cookieOption);
    res.cookie("refreshToken", refreshToken, cookieOption);


    if (isNewUser) {
      try {
        const welcomeEmailUrl = `${process.env.FRONTEND_URL}/xac-thuc-email?code=${user._id}`;
        await sendEmail({
          sendTo: email,
          subject: "Chào mừng bạn đến với TP - Đăng nhập Google thành công!",
          html: verifyEmailTemplate({
            name: name || "bạn",
            url: welcomeEmailUrl,
            isGoogleWelcome: true,
          }),
        });
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }


    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profile_image: user.profile_image,
      status: user.status,
      verify_email: user.verify_email,
    };

    return res.json({
      success: true,
      message: "Login with Google successful",
      data: { accessToken, refreshToken, user: userResponse, isNewUser },
    });
  } catch (error) {
    console.error("googleLoginController error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
