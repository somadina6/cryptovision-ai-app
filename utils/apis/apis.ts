import axios from "axios";
import { ApiResponse, TokenData } from "../../types/types";
import { mutate } from "swr";
import toast from "react-hot-toast";

export async function getTokens() {
  try {
    const { data, status, headers } = await axios.get<TokenData[]>(
      `/api/token`
    );

    if (status === 200) {
      return data;
    } else if (status === 307) {
      const newUri = headers.Location;
      console.log("newUri", newUri);
      if (newUri && newUri.startsWith("/auth/login")) {
        window.location.href = newUri;
      } else {
        throw new Error("Redirect location not provided or invalid");
      }
    } else {
      throw new Error("Failed to fetch tokens");
    }
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
      // await mutate(`fetchUserTokens`);
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
      toast.success("Token deleted");
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

export async function updateToken(tokenId: string, amount: number) {
  try {
    const { data, status } = await axios.put<TokenData>(`/api/token`, {
      tokenId,
      amount,
    });
    if (status === 200 || status === 201) {
      return data;
    }
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
export function formatPrice(
  price: number,
  currency: string,
  rate: number
): string {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(price * rate);

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
    const { data, status } = await axios.get(ecburl);

    if (status !== 200) throw new Error("Failed to fetch exchange rates");

    if (!data || !data.usd) throw new Error("Invalid response");

    if (status === 200) return data.usd;
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
    const { data: rates } = await axios.get<{
      [key: string]: number;
    }>(`/api/exchange`);
    const rate = rates[toCurrency.toLowerCase()];
    return amount * rate;
  } catch (error) {
    console.log(error);
    throw new Error("Failed To Convert");
  }
};

type CurrencyRates = {
  [key: string]: number;
};
export async function getCurrencyRates() {
  try {
    const { data } = await axios.get<CurrencyRates>(`/api/exchange`);
    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error("Failed to fetch currency rates");
  }
}
