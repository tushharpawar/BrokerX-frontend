import { combineReducers } from "redux";
import userSlice from "./reducers/userSlice";
import stockSlice from "./reducers/stockSlice";
import holdingSlice from "./reducers/holdingSlice";

const rootReducer = combineReducers({
    user:userSlice,
    stocks: stockSlice,
    holdings:holdingSlice
})

export default rootReducer;