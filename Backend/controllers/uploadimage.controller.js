import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImageController = async (request, response) => {
  try {
    const file = request.file;
    const uploadImage = await uploadImageCloudinary(file);
    return response.json({
      message: "Tải ảnh thành công",
      data: uploadImage,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};
export default uploadImageController;
