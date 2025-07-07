import { BASE_URL, GIPHY_API_KEY } from '@env';

export const REGISTER = `${BASE_URL}/oauth/register`;
export const LOGIN = `${BASE_URL}/oauth/login`;
export const REFRESH_TOKEN = `${BASE_URL}/oauth/refresh-token`;
export const UPLOAD = `${BASE_URL}/file/upload`;
export { GIPHY_API_KEY };
export const GET_STOCKS = `${BASE_URL}/api/stocks`;
export const BUY_HOLDINGS = `${BASE_URL}/api/holdings/buy`;
export const SELL_HOLDINGS = `${BASE_URL}/api/holdings/sell`;
export const FETCH_ORDER_HISTORY = `${BASE_URL}/api/orders/user`;
export const FETCH_TRANSACTION_HISTORY = `${BASE_URL}/api/transactions/get-transactions/user`;
export const WITHDRAW_MONEY = `${BASE_URL}/api/razorpay/withdraw`;
export const GET_GENERAL_NEWS = `${BASE_URL}/api/news`;
export const GET_TRENDING_NEWS = `${BASE_URL}/api/news/trending`;
export const SEARCH_STOCKS = `${BASE_URL}/api/search/suggestions`;
export const GET_STOCK_QUOTE = `${BASE_URL}/api/stocks/quote`;

// Export BASE_URL for direct use
export { BASE_URL };