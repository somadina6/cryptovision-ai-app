import axios from "axios";
import { DeleteResult } from "mongodb";

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

export type TokenData = {
  _id?: string;
  userId: string | null;
  coinId: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  image?: string;
  price_change_percentage_24h?: number;
};
export async function addToken(userTokenData: TokenData) {
  try {
    const { data } = await axios.post<TokenData>("/api/token", {
      userTokenData,
    });
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
