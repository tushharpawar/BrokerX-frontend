import { SELL_HOLDINGS } from "../API";
import { appAxios } from "../apiConfig";

export const sellHoldingsAction = async (values:any) => {
    try {
        const response = await appAxios.post(SELL_HOLDINGS,values)
        console.log('Sell holdings response:', response.data);
        return response;
    } catch (error) {
        console.error('Error buying holdings:', error);
        throw error;
    }
}