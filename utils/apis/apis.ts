import axios from "axios";
import { DeleteResult } from "mongodb";
import { coingeckoAxios } from "../axios/axios";
import { ApiResponse, CoingeckoResponse, TokenData } from "../../types/types";
import { mutate } from "swr";

export async function getTokens() {
  try {
    const { data } = await axios.get<TokenData[]>(`/api/token`);
    // console.log(data);
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function addToken(tokenId: string, amount: number) {
  try {
    const { data, status } = await axios.post<TokenData>(`/api/token`, {
      tokenId,
      amount,
    });
    if (status === 200 || status === 201) {
      await mutate(`fetchUserTokens`);
      return data;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function deleteToken(tokenId: string) {
  try {
    const { data, status } = await axios.delete<ApiResponse>(`/api/token`, {
      data: { tokenId },
    });
    if (status === 200 || status === 204) {
      await mutate(`fetchUserTokens`);
      console.log(data);
      return data;
    } else {
      throw new Error("Failed to delete token");
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export function formatPrice(price: number, currency: string): string {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}

export async function fetchSearchResults(query: string) {
  try {
    const { data } = await axios.get(`/api/token/search/${query}`);
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch search results");
  }
}

export const fetchExchangeRates = async () => {
  const ecburl = process.env.NEXT_PUBLIC_ECB_API_URL;
  if (!ecburl) throw new Error("Fetch URL Not Available");

  try {
    const response = await fetch(ecburl);
    if (!response) throw new Error("No Response from CUrrency Exchange API");

    const data = await response.json();

    return data.usd;
  } catch (error) {
    console.log(error);
  }
};

export const convertCurrency = async (
  amount: number,
  toCurrency: string
): Promise<number> => {
  // if (toCurrency === "USD") return amount;
  try {
    const rates = await fetchExchangeRates();
    const rate: number = rates[toCurrency.toLowerCase()];
    return amount * rate;
  } catch (error) {
    console.log(error);
    throw new Error("Failed To Convert");
  }
};
