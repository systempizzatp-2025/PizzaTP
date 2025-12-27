import { request } from "express";
import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    const {
      productId,
      size,
      base,
      sizePrice = 0,
      basePrice = 0,
      quantity = 1,
    } = request.body;

    if (!productId) {
      return response.status(402).json({
        message: "Cung cấp productId",
        error: true,
        success: false,
      });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId,
      productId,
      size: size || null,
      base: base || null,
    });

    if (checkItemCart) {
      return response.status(400).json({
        message: "Sản phẩm có cùng kích thước/cơ sở đã có trong giỏ hàng",
      });
    }

    const cartItem = new CartProductModel({
      quantity: quantity, 
      userId,
      productId,
      size: size || null,
      base: base || null,
      sizePrice,
      basePrice,
    });

    const save = await cartItem.save();

    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    return response.json({
      data: save,
      message: "Sản phẩm đã được thêm vào giỏ hàng",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const getCartItemController = async (request, response) => {
  try {
    const userId = request.userId;

    const cartItem = await CartProductModel.find({
      userId: userId,
    }).populate("productId");

    return response.json({
      data: cartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId;

    const { _id, qty } = request.body;

    if (!_id || !qty) {
      return response.status(400).json({
        message: " Provide _id, qty",
      });
    }

    const updateCartitem = await CartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: qty,
      }
    );

    return response.json({
      message: "Đã thêm",
      success: true,
      error: false,
      data: updateCartitem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteCartItemQtyController = async (request, response) => {
  try {
    const userId = request.userId; //middleware

    const { _id } = request.body;
    if (!_id) {
      return response.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId,
    });

    return response.json({
      message: "Xóa thành công",
      error: false,
      success: true,
      data: deleteCartItem,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
