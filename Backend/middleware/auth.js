import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token =
      req.headers?.authorization?.replace("Bearer ", "") ||
      req.cookies?.accessToken ||
      null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: error.message || error,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    req.userId = decoded.id || decoded._id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: true,
    });
  }
};

export default auth;
