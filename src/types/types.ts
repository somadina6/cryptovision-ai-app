export type CoingeckoResult = {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
  ath?: number;
  low_24h?: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
};

export type TokenData = {
  _id?: string;
  userId: string | null;
  coinId: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  image?: string;
  price_change_percentage_24h: number;
};

export type CoingeckoResponse = {
  usd: number;
  usd_24h_change: number;
};
