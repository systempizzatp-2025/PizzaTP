import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosUser from '../utils/AxiosUser';
import SummaryApi from '../common/SummaryApi';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosUser({ ...SummaryApi.getUserFavorites });
      if (response.data?.success) {
        return response.data.data || [];
      }
      return rejectWithValue('Failed to fetch favorites');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      await AxiosUser({
        ...SummaryApi.removeFavorite,
        url: `${SummaryApi.removeFavorite.url}/${productId}`,
        method: "delete"
      });
      return productId; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove favorite');
    }
  }
);
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      // SỬA: Dùng đúng format { product: productId }
      const response = await AxiosUser({
        ...SummaryApi.addFavorite,
        data: { product: productId } // <-- ĐÂY LÀ FIX
      });
      
      if (response.data?.success) {
        return response.data.data; 
      }
      return rejectWithValue(response.data?.message || 'Failed to add favorite');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add favorite');
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
      state.lastUpdated = null;
    },
    setFavoritesLoading: (state, action) => {
      state.loading = action.payload;
    },
    optimisticRemoveFavorite: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (action.payload && !state.items.find(item => item._id === action.payload._id)) {
          state.items.push(action.payload);
        }
      });
  },
});

export const { clearFavorites, setFavoritesLoading, optimisticRemoveFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;