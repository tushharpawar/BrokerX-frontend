// Helper function to check if user owns a particular stock
export const checkIfUserOwnsStock = (holdings: any[], symbol: string): boolean => {
  return holdings.some((holding: any) => holding.symbol === symbol && holding.quantity > 0);
};

// Helper function to get user's holding for a specific stock
export const getUserHoldingForStock = (holdings: any[], symbol: string) => {
  return holdings.find((holding: any) => holding.symbol === symbol);
};
