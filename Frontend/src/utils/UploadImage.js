import Axios from "../utils/AxiosUser.js";
import SummaryApi from "../common/SummaryApi.js";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);

    const response = await Axios({
      ...SummaryApi.uploadImage,
      data: formData,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
export default uploadImage;
