import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  _id: "",
  name: "",
  email: "",
  profile_image: "",
  mobile: "",
  verify_email: "",
  last_login_date: "",
  status: "",
  address_details: [],
  shopping_cart: [],
  orderHistory: [],
  favorites: [],
  notifications: [],
  role: "",
};
const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.profile_image = action.payload?.profile_image;
      state.mobile = action.payload?.mobile;
      state.verify_email = action.payload?.verify_email;
      state.last_login_date = action.payload?.last_login_date;
      state.status = action.payload?.status;
      state.address_details = action.payload?.address_details;
      state.shopping_cart = action.payload?.shopping_cart;
      state.orderHistory = action.payload?.orderHistory;
      state.favorites = action.payload?.favorites;
      state.notifications = action.payload?.notifications;
      state.role = action.payload?.role;
    },
    updateProfile: (state, action) => {
      state.profile_image = action.payload.profile_image;
    },
    logout: (state, action) => {
      (state._id = ""),
        (state.name = ""),
        (state.email = ""),
        (state.profile_image = ""),
        (state.mobile = ""),
        (state.verify_email = ""),
        (state.last_login_date = ""),
        (state.status = ""),
        (state.address_details = []),
        (state.shopping_cart = []),
        (state.orderHistory = []),
        (state.favorites = []),
        (state.notifications = []),
        (state.role = "");
    },
  },
});

export const { setUserDetails, logout, updateProfile } = userSlice.actions;
export default userSlice.reducer;
