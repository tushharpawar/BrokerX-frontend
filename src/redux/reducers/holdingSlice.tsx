import { createSlice,PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
    holdings: [],
}

const holdingSlice = createSlice({
    name: 'holdings',
    initialState,
    reducers: {
        setHoldings: (state, action: PayloadAction<any[]>) => {
            state.holdings = action.payload.map(holding => ({
                ...holding,
                lastPrice: parseFloat(holding?.profile.price) || 0,
                price: parseFloat(holding?.profile.price) || 0,
            }));
        },
        updateHoldingPrice: (state, action: PayloadAction<{symbol: string, price: number}>) => {
            const { symbol, price } = action.payload;
            const index = state.holdings.findIndex((h: any) => h.symbol === symbol);
            if (index !== -1) {
                state.holdings[index].price = price;
            }
        },
    }
});

export const { setHoldings, updateHoldingPrice } = holdingSlice.actions;
export const selectHoldings = (state: any) => state.holdings.holdings;
export default holdingSlice.reducer;