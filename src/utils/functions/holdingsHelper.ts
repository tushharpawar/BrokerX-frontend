export const checkIfUserOwnsStock = (holdings: any[], symbol: string): boolean => {
  return holdings.some((holding: any) => holding.symbol === symbol && holding.quantity > 0);
};

export const getUserHoldingForStock = (holdings: any[], symbol: string) => {
  return holdings.find((holding: any) => holding.symbol === symbol);
};
