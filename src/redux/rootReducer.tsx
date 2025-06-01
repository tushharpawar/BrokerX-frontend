import { combineReducers } from "redux";
import userSlice from "./reducers/userSlice";
import stockSlice from "./reducers/stockSlice";

const rootReducer = combineReducers({
    user:userSlice,
    stocks: stockSlice,
})

export default rootReducer;