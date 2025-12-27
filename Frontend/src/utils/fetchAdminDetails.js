import AxiosAdmin from "./AxiosAdmin";
import SummaryApi from "../common/SummaryApi";

const fetchAdminDetails = async (token) => {
  try {
    const apiUrl = SummaryApi.userDetailsAdmin;

    const response = await AxiosAdmin({
      url: apiUrl.url,
      method: apiUrl.method,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${
          token || localStorage.getItem("adminAccessToken")
        }`,
      },
    });

    return response;
  } catch (error) {
    return error.response || { data: null, message: error.message };
  }
};

export default fetchAdminDetails;
