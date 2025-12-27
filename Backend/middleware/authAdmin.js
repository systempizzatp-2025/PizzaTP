import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.replace("Bearer ", "") || null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Yêu cầu mã thông báo quản trị",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền admin",
      });
    }

    req.userId = decoded.id || decoded._id;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Mã thông báo quản trị không hợp lệ hoặc đã hết hạn",
    });
  }
};

export default authAdmin;
