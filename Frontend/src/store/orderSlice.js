import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: [],
    loading: false,
    error: null,
    cancelLoading: false,
  },
  reducers: {
    setOrder: (state, action) => {
      state.order = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    removeOrder: (state, action) => {
      state.order = state.order.filter(item => item.orderId !== action.payload);
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setCancelLoading: (state, action) => {
      state.cancelLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    resetOrders: (state) => {
      state.order = [];
      state.loading = false;
      state.error = null;
      state.cancelLoading = false;
    },
  },
});

export const { 
  setOrder, 
  removeOrder,
  setLoading, 
  setCancelLoading, 
  setError,
  resetOrders,
} = orderSlice.actions;

export default orderSlice.reducer;