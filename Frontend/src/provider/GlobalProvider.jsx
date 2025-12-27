import { createContext, useContext, useEffect } from "react";
import AxiosUser from "../utils/AxiosUser";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart, handleClearCart } from "../store/cartProduct";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";
import { fetchFavorites, clearFavorites } from '../store/favoritesSlice';
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";

export const GlobalContext = createContext(null);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const fetchCartItem = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(handleClearCart());
      localStorage.removeItem("cart");
      return;
    }

    try {
      const response = await AxiosUser({ ...SummaryApi.getCartItem });
      if (response.data?.success) {
        dispatch(handleAddItemCart(response.data.data));
        localStorage.setItem("cart", JSON.stringify(response.data.data));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(handleClearCart());
        localStorage.removeItem("cart");
      } else {
        AxiosToastError(error);
      }
    }
  };

  const updateCartItem = async (id, qty) => {
    try {
      const response = await AxiosUser({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      if (response.data?.success) {
        toast.success(response.data.message);
        await fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await AxiosUser({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      if (response.data?.success) {
        toast.success(response.data.message);
        await fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchOrder = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await AxiosUser({ ...SummaryApi.getOrderItems });
      if (response.data?.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await AxiosUser({ ...SummaryApi.getAddress });
      if (response.data?.success) {
        dispatch(handleAddAddress(response.data.data));
      }
    } catch (error) {
      console.error("Fetch address error:", error);
      AxiosToastError(error);
    }
  };

  const fetchUserFavorites = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(clearFavorites());
      return;
    }

    try {
      await dispatch(fetchFavorites()).unwrap();
    } catch (error) {
      console.error("Fetch favorites error:", error);

    }
  };


  const refreshFavorites = async () => {
    await fetchUserFavorites();
  };

  useEffect(() => {
    if (!user?._id) {
    
      dispatch(clearFavorites());
      return;
    }
    
   
    fetchUserFavorites();
  }, [user?._id, dispatch]);

  useEffect(() => {
    if (!user?._id) return;
    
    fetchCartItem();
    fetchAddress();
    fetchOrder();
  }, [user?._id]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch(handleClearCart());
      localStorage.removeItem("cart");
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        fetchOrder,
        fetchUserFavorites,
        refreshFavorites, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;