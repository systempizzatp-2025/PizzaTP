import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generatedRefreshToken = async (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  await UserModel.updateOne({ _id: userId }, { refresh_token: token });

  return token;
};

export default generatedRefreshToken;
