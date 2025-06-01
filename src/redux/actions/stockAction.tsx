import axios from 'axios';
import { GET_STOCKS } from '../API';
import { setStocks } from '../reducers/stockSlice';

export const fetchStocks = () => async (dispatch: any) => {
  try {
    const response = await axios.get(GET_STOCKS);
    dispatch(setStocks(response.data));
    console.log('Stocks fetched successfully:', response.data);
    return response.data; // Return the data for further use if needed
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw error;
  }
};

export const testThunk = () => (dispatch: any) => {
  console.log('Thunk dispatched!');
};