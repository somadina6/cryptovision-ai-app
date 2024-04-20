export type CoingeckoResult = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
  ath?: number;
  low_24h?: number;
  price_change_percentage_24h?: number;
  market_cap_rank: number;
};
