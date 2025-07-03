import { FETCH_TRANSACTION_HISTORY } from "../API";
import { appAxios } from "../apiConfig";

export const fetchTransactionsAction = async (values: { userId: string; cursor: string }) => {
    try {
        const response = await appAxios.get(`${FETCH_TRANSACTION_HISTORY}/${values?.userId}/?cursor=${values?.cursor}&limit=50`)
        return response;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
}
