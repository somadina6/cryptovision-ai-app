import axios from "axios";
import { DeleteResult } from "mongodb";
import { coingeckoAxios } from "../axios/axios";
import { CoingeckoResponse, TokenData } from "../../types/types";

export async function getTokens(userId: string) {
  try {
    const { data } = await axios.get<TokenData[]>(`/api/token/${userId}`);
    // console.log(data);
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function addToken(
  userId: string,
  tokenId: string,
  amount: number
) {
  console.log(userId, tokenId, amount);
  try {
    const { data, status } = await axios.post<TokenData>(
      `/api/token/${userId}`,
      {
        tokenId,
        amount,
      }
    );
    return data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}

export async function deleteToken(tokenId: string) {
  try {
    const { data: result } = await axios.delete<DeleteResult>("/api/token", {
      data: { tokenId },
    });
    return result;
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

export const updateTokens = async (
  tokens: TokenData[],
  coingeckoResponse: CoingeckoResponse
) => {
  return tokens.map((token) => {
    const realTimePrice = coingeckoResponse[token.coinId].usd || 0;
    const priceChange = coingeckoResponse[token.coinId].usd_24h_change || 0;

    return {
      ...token,
      price: realTimePrice,
      price_change_percentage_24h: priceChange,
    };
  });
};

export const fetchRealTimePrices = async (tokens: TokenData[]) => {
  const coinIds = tokens.map((token) => token.coinId).join(",");
  try {
    const { data, status } = await coingeckoAxios.get("/simple/price", {
      params: {
        vs_currencies: "usd",
        ids: coinIds,
        include_24hr_change: "true",
      },
    });
    console.log(data);
    if (status == 200) {
      return data;
    } else {
      throw new Error("Failed to get update prices");
    }
  } catch (error: any) {
    console.error("Error fetching real time price:", error);
    if (axios.isAxiosError(error)) {
      console.log({
        request_error: error.request,
        response_status: error.response?.status,
        response_text: error.response?.statusText,
        response_data_error: error.response?.data,
        error_message: error.message,
        error_status_code: error.status,
      });
    }
    throw new Error("Error fetching realtime price");
  }
};
