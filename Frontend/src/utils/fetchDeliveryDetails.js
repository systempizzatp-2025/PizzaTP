import AxiosDelivery from "./AxiosDelivery";
import SummaryApi from "../common/SummaryApi";

const fetchDeliveryDetails = async (token) => {
  try {
    const apiUrl = SummaryApi.userDetailsDelivery;

    const response = await AxiosDelivery({
      url: apiUrl.url,
      method: apiUrl.method,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${
          token || localStorage.getItem("deliveryAccessToken")
        }`,
      },
    });

    return response;
  } catch (error) {
    return error.response || { data: null, message: error.message };
  }
};

export default fetchDeliveryDetails;
