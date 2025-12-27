import Favorite from "../models/favorite.model.js";


export const addFavorite = async (req, res) => {
  try {
    const user = req.userId; 
    const { product } = req.body;

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Missing product ID" });
    }

    const favorite = await Favorite.findOne({ user, product });
    if (favorite) {
      return res
        .status(400)
        .json({ success: false, message: "Đã yêu thích sản phẩm này" });
    }

    const newFavorite = await Favorite.create({ user, product });
    res.json({ success: true, data: newFavorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeFavorite = async (req, res) => {
  try {
    const user = req.userId; 
    const product = req.params.productId;

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Missing product ID" });
    }

    const deleted = await Favorite.findOneAndDelete({ user, product });
    if (!deleted) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Sản phẩm không tồn tại trong yêu thích",
        });
    }

    res.json({ success: true, message: "Đã xóa khỏi yêu thích" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUserFavorites = async (req, res) => {
  try {
    const user = req.userId;
    const favorites = await Favorite.find({ user }).populate("product");

    res.json({ success: true, data: favorites.map((f) => f.product) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
