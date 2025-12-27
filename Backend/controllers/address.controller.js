import { request } from "express";
import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const {
      label,
      fullName,
      phoneNumber,
      street,
      ward,
      district,
      city,
      country,
      postalCode,
      isDefault,
      notes,
    } = request.body;

    const createAddress = new AddressModel({
      userId: userId,
      label,
      fullName,
      phoneNumber,
      street,
      ward,
      district,
      city,
      country,
      postalCode,

      isDefault,
      notes,
    });

    const saveAddress = await createAddress.save();

    const addUserAddressId = await UserModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    return response.json({
      message: "Thêm địa chỉ thành công",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getAddressController = async (request, response) => {
  try {
    const userId = request.userId;

    const data = await AddressModel.find({
      userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return response.json({
      success: true,
      error: false,
      message: "Danh sách địa chỉ",
      data,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};

export const updateAddressController = async (request, response) => {
  try {
    const userId = request.userId; // middlware

    const {
      label,
      fullName,
      phoneNumber,
      street,
      ward,
      district,
      city,
      country,
      postalCode,
      isDefault,
      notes,
    } = request.body;

    const updateAddress = await AddressModel.updateOne(
      { userId: userId },
      {
        label,
        fullName,
        phoneNumber,
        street,
        ward,
        district,
        city,
        country,
        postalCode,
        isDefault,
        notes,
      }
    );

    return response.json({
      message: "Cập nhật địa chỉ thành công",
      error: false,
      success: true,
      data: updateAddress,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    const address = await AddressModel.findOne({ _id, userId });

    if (!address) {
      return response.status(404).json({
        success: false,
        error: true,
        message: "Không tìm thấy địa chỉ",
      });
    }

    await AddressModel.updateOne(
      { _id, userId },
      { isDeleted: true, isDefault: false }
    );

    if (address.isDefault) {
      const nextDefault = await AddressModel.findOne({
        userId,
        isDeleted: false,
      }).sort({ createdAt: -1 });

      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    return response.json({
      success: true,
      error: false,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};
