import jwt from "jsonwebtoken";

const generatedAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "3h" }
  );
};

export default generatedAccessToken;
