import SummaryApi from "../common/SummaryApi";
import Axios from "./AxiosUser";

const fetchUserDetails = async () => {
  try {

    const token = localStorage.getItem("accessToken");
    if (!token) {
    
      return { data: null };
    }

    const response = await Axios({ ...SummaryApi.userDetails });
    return response;
  } catch (error) {

    return { data: null };
  }
};

export default fetchUserDetails;
