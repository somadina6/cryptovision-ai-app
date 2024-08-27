import { ObjectId } from "mongodb";

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
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

export type Token = {
  _id: ObjectId;
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number; // All-time high
  ath_date: string; // Date in ISO format
  atl: number; // All-time low
  atl_date: string; // Date in ISO format
  last_updated: string; // Date in ISO format
};
