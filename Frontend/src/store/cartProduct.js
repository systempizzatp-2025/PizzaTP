import { createSlice } from "@reduxjs/toolkit";

const initialCart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
  name: "cartItem",
  initialState: { cart: initialCart },
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = [...action.payload];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    handleClearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { handleAddItemCart, handleClearCart } = cartSlice.actions;
export default cartSlice.reducer;
