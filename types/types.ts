import { Token as SupabaseToken } from "./database";

export type ApiResponse = {
  status?: number;
  message: string;
  success: boolean;
};

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

export type CoingeckoResponse = {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
};

export type Token = SupabaseToken;

export interface Currency {
  code: string;
  label: string;
}
