"use client";
import "./styles.css";
import { UserContext } from "@/context/userContext";
import {
  TokenData,
  addToken,
  deleteToken,
  formatPrice,
  getTokens,
} from "@/utils/apis/apis";
import React, { FC, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MutatingDots } from "react-loader-spinner";
import { CiSearch, CiTrash } from "react-icons/ci";
import useSWR, { mutate } from "swr";
import SearchResultModal from "./SearchResultModal";
import Image from "next/image";
import Backdrop from "../Backdrop/Backdrop";
import axios from "axios";
import { useSession } from "next-auth/react";
import SessionExpiredModal from "../SessionExpiredModal/SessionExpiredModal";

type Props = {
  coinDetails: TokenData[] | undefined;
};

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

const Table = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  // const { userId } = useContext(UserContext);
  const { data: session } = useSession();
  const [searchResults, setSearchResults] = useState<CoingeckoResult[]>();
  const [searchLoading, setSearchLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const inputStyles =
    "block w-full p-2 h-full text-md border-none rounded-md dark:text-black";

  const userId = session ? session.user.id : "";
  const initTokenDetail: TokenData = {
    userId,
    coinId: "",
    name: "",
    symbol: "",
    amount: 0,
    price: 0,
    image: "",
  };

  const [tokenToAddDetails, setTokenToAddDetails] =
    useState<TokenData>(initTokenDetail);

  const resetFields = async () => setTokenToAddDetails(initTokenDetail);

  const fetchSearchResults = async (query: any) => {
    setSearchLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/list?include_platform=false`, // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd
        { timeout: 5000 }
      );
      const data: CoingeckoResult[] = await response.data;
      const filteredResults = data.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase())
      );
      //   console.log(filteredResults);

      setSearchResults(filteredResults);
      setSearchLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const removeUserToken = async (id: string | undefined) => {
    const loadingId = toast.loading("Deleting Token");

    try {
      if (id) {
        const res = await deleteToken(id);
        if (res.acknowledged === true) {
          toast.success("Deleted successfully", { id: loadingId });
          mutate("getUserTokens");
        } else {
          toast.error("Failed to delete", { id: loadingId });
        }
      }
    } catch (error) {}
  };

  const addUserTokens = async () => {
    const loadingId = toast.loading("Adding Token");
    try {
      const newTokenAdded = await addToken({
        ...tokenToAddDetails,
        userId: userId,
      });
      toast.success("Added successfully", { id: loadingId });
      resetFields();
      mutate("getUserTokens");
      return newTokenAdded;
    } catch (error) {
      toast.error("Failed to add", { id: loadingId });
    }
  };

  const fetchUserTokens = async () => {
    try {
      const tokens = await getTokens(userId);

      return tokens;
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      throw error; // Re-throw the error to handle it in useEffect
    }
  };

  const fetchRealTimePrices = async (tokens: TokenData[] | undefined) => {
    if (tokens) {
      const coinIds = tokens.map((token) => token.coinId).join(",");
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            vs_currencies: "usd",
            ids: coinIds,
          },
        }
      );

      return response.data;
    }
  };

  const fetchPriceChange24h = async (tokens: TokenData[] | undefined) => {
    try {
      if (!tokens) return null;

      const coinIds = tokens.map((token) => token.coinId).join(",");
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        {
          params: {
            vs_currencies: "usd",
            ids: coinIds,
            include_24hr_change: "true",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching 24h price change:", error);
      return null;
    }
  };

  const updateTokens = async (
    tokens: TokenData[] | undefined,
    prices: any,
    priceChange24h: any
  ) => {
    if (!tokens) return undefined;

    return tokens.map((token) => {
      const realTimePrice = prices[token.coinId]?.usd || 0;
      const priceChange = priceChange24h[token.coinId]?.usd_24h_change || 0;

      return {
        ...token,
        price: realTimePrice,
        price_change_percentage_24h: priceChange,
      };
    });
  };

  const updatePricesAndSaveToDB = async () => {
    if (isUpdating) {
      return; // Exit early if an update is already in progress
    }
    setIsUpdating(true); // Set update status to true
    const toastId = toast.loading("Fetching Prices");
    if (!coinDetails) {
      setIsUpdating(false);
      toast.remove(toastId);

      return;
    }

    try {
      const realTimePrices = await fetchRealTimePrices(coinDetails);
      const realTime24h = await fetchPriceChange24h(coinDetails);

      const updatedUserTokens = await updateTokens(
        coinDetails,
        realTimePrices,
        realTime24h
      );

      const { data } = await axios.put(
        "/api/token",
        {
          data: { userId, updatedUserTokens },
        },
        { timeout: 3000 }
      );

      if (data.success) {
        mutate("getUserTokens");
        toast.success("Prices Updated", { id: toastId });
      } else {
        toast.error("Failed to fetch prices", { id: toastId });
      }
      return data;
    } catch (error) {
      console.log("Error updating prices:", error);
      toast.error("An error occurred while updating prices", { id: toastId });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  let {
    data: coinDetails,
    error: fetchingError,
    isLoading,
  } = useSWR("getUserTokens", fetchUserTokens, { revalidateOnFocus: true });

  useSWR("updatePricesAndSaveToDB", updatePricesAndSaveToDB, {
    revalidateOnFocus: false,
    refreshInterval: 3 * 60000,
    // focusThrottleInterval: 30000,
    errorRetryInterval: 0,
    revalidateIfStale: false,
  });

  useEffect(() => {
    // Fetch initial user tokens
    if (userId) {
      const fetchData = async () => {
        try {
          const tokens = await fetchUserTokens();
          if (tokens) {
            mutate("getUserTokens", tokens); // Update SWR cache
          }
        } catch (error) {
          console.error("Error fetching user tokens:", error);
        }
      };
      fetchData();
    }
    return () => {};
  });

  return (
    <div className="md:w-full ">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-black dark:text-primary uppercase border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 w-5/12">Coin</th>
            <th className="px-6 py-3">Symbol</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">24HR</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Total</th>

            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-black dark:text-white uppercase">
          {isLoading && (
            <div className="text-primary">
              <MutatingDots height="100" width="100" />
            </div>
          )}

          {coinDetails &&
            !isLoading &&
            !fetchingError &&
            coinDetails.map((coin, index) => (
              <tr
                key={coin._id}
                className="border-b hover:bg-gray-50 dark:hover:text-primary  dark:hover:bg-gray-950 h-10 overflow-clip"
              >
                <th className="px-6 py-4 flex gap-2 items-center">
                  <p className="">{coin.name}</p>
                  <span>
                    {coin.image && (
                      <Image
                        src={coin.image}
                        alt={coin.name}
                        width={20}
                        height={20}
                      />
                    )}
                  </span>
                </th>
                <td className="px-6 py-4">{coin.symbol}</td>
                <td className="px-6 py-4">${coin.price}</td>
                {coin.price_change_percentage_24h ? (
                  <td
                    className={`px-6 py-4 ${
                      coin.price_change_percentage_24h < 0
                        ? "text-red-600"
                        : "text-green-500"
                    }`}
                  >
                    {coin.price_change_percentage_24h > 0 ? "+" : ""}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                ) : (
                  <td></td>
                )}

                <td className="px-6 py-4">{coin.amount}</td>
                <td className="px-6 py-4">
                  {formatPrice(coin.amount * coin.price)}
                </td>
                <td
                  className="px-6  hover:text-red-500 "
                  id={coin._id}
                  onClick={() => removeUserToken(coin._id)}
                >
                  <CiTrash
                    size={17}
                    color="red"
                    className="hover:font-bold cursor-pointer "
                  />
                </td>
              </tr>
            ))}

          {/* SEARCH ROW BEGIN*/}
          <tr className="">
            <th className="px-6 py-3 font-sans flex gap-2 items-center">
              <input
                className={inputStyles}
                type="search"
                placeholder="Search token..."
                value={tokenToAddDetails.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchSearchResults(tokenToAddDetails.name);
                    setShowSearch(true);
                  }
                }}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  if (inputValue === "") {
                    resetFields();
                  } else {
                    setTokenToAddDetails({
                      ...tokenToAddDetails,
                      name: inputValue,
                    });
                  }
                }}
              />
              <CiSearch
                className="text-2xl dark:text-primary cursor-pointer hover:font-bold"
                onClick={() => {
                  fetchSearchResults(tokenToAddDetails.name);
                  setShowSearch(true);
                }}
              />
            </th>
            <td className="px-6 py-4">{tokenToAddDetails.symbol}</td>
            <td className="px-6 py-4">${tokenToAddDetails.price}</td>
            <td className="px-6 py-4">
              {tokenToAddDetails.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td className="px-6 py-4">
              <input
                className={`${inputStyles} no-spinners`}
                type="number"
                placeholder="Amount"
                inputMode="decimal"
                step="any"
                value={tokenToAddDetails.amount}
                disabled={!tokenToAddDetails.price}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const parsedValue = parseFloat(inputValue);

                  setTokenToAddDetails({
                    ...tokenToAddDetails,
                    amount: parsedValue,
                  });
                }}
              />
            </td>
            <td className="px-6 py-4">
              {formatPrice(tokenToAddDetails.amount * tokenToAddDetails.price)}
            </td>
            <td className="px-6 py-4 hover:text-primary">
              <button
                onClick={addUserTokens}
                disabled={!tokenToAddDetails.price}
              >
                Add
              </button>
            </td>
          </tr>
          {/* END OF TABLE  */}
        </tbody>
      </table>
      <div className="w-full ">
        <Backdrop isOpen={showSearch} />
        <SearchResultModal
          search={searchResults}
          tokenToAddDetails={tokenToAddDetails}
          setTokenToAddDetails={setTokenToAddDetails}
          showModal={showSearch}
          setShowModal={setShowSearch}
          searchLoading={searchLoading}
        />
      </div>
    </div>
  );
};

export default Table;
