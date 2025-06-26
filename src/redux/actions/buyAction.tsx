import { appAxios } from '../apiConfig';
import { BASE_URL, BUY_HOLDINGS } from '../API';
import { setHoldings } from '../reducers/holdingSlice';

export const buyHoldingsAction = async (values:any) => {
    try {
        const response = await appAxios.post(BUY_HOLDINGS,values)
        return response;
    } catch (error) {
        console.error('Error buying holdings:', error);
        throw error;
    }
}

export const getHoldingsAction = ({userId}:any)=>async (dispatch:any) => {
    try {
        const response = await appAxios.get(`${BASE_URL}/api/holdings/user/${userId}`);
        console.log("Response from getHoldingsAction:", response.data);
        await dispatch(setHoldings(response.data.holdings));
        return response.data;
    } catch (error) {
        console.error('Error fetching holdings:', error);
        throw error;
    }
}