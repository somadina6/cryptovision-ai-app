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
  userId: string;
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
export function formatPrice(price: number): string {
  // Format number to USD locale
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}
