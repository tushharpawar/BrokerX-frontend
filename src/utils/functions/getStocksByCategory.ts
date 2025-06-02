// utils/stockHelpers.ts
export const getStocksByCategory = (stocks:any, category:any, limit = 3) => {
  return stocks
    .filter((stock:any) => stock.category === category)
};
