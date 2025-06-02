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
    },
    patchStock: (state, action: PayloadAction<any>) => {
      const card = action.payload;
      const index = state.stocks.findIndex((s: any) => s.symbol === card.symbol);
      if (index !== -1) {
        state.stocks[index] = card;
      } else {
        state.stocks.push(card);
      }
    }
  }
});

export const { setStocks,patchStock } = stockSlice.actions;
export const selectStocks = (state: { stocks: StockState }) => state.stocks.stocks;
export default stockSlice.reducer;
