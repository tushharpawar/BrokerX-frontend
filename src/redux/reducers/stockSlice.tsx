import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type StockState = {
    stocks: any[]; // Changed from StockCard[] to any[]
    items?: any;
};

const initialState: StockState = {
    stocks: [],
    items: undefined
};
const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setStocks: (state, action: PayloadAction<any[]>) => {
      state.stocks = action.payload; // Changed from StockCard[] to any[]
    }},
});

export const { setStocks } = stockSlice.actions;
export const selectStocks = (state: { stocks: StockState }) => state.stocks.stocks;
export default stockSlice.reducer;
