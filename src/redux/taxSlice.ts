import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTaxRates } from '../apis/taxCalculatorApi';

interface TaxState {
  taxRates: { [year: number]: any };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaxState = {
  taxRates: {},
  status: 'idle',
  error: null,
};

export const fetchTaxRatesByYear = createAsyncThunk(
  'tax/fetchTaxRatesByYear',
  async (year: number) => {
    const response = await fetchTaxRates(year);
    return { year, response };
  }
);

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxRatesByYear.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaxRatesByYear.fulfilled, (state, action) => {
        const { year, response } = action.payload;
        state.taxRates[year] = response;
        state.status = 'succeeded';
      })
      .addCase(fetchTaxRatesByYear.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch tax rates';
      });
  },
});

export default taxSlice.reducer;
