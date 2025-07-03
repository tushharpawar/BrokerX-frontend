import { FETCH_ORDER_HISTORY } from "../API";
import { appAxios } from "../apiConfig";

export const fetchOrdersAction = async (values: { userId: string; cursor: string }) => {
    try {
        const response = await appAxios.get(`${FETCH_ORDER_HISTORY}/${values?.userId}/?cursor=${values?.cursor}&limit=100`)
        return response;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
}