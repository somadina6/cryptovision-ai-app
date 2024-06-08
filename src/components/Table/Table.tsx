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
import axios, { AxiosError } from "axios";
import { CoingeckoResult } from "@/types/types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUserTokens } from "@/store/features/tokenSlice";
import useSWRImmutable from "swr/immutable";
import { coingeckoAxios } from "@/utils/axios/axios";

const inputStyles =
  "block w-full p-2 h-full text-md border-none rounded-md dark:text-black";

const Table: FC<{ userId: string }> = ({ userId }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<CoingeckoResult[]>();
  const [searchLoading, setSearchLoading] = useState(false);
  const [isUserTokensLoading, setUserTokensLoading] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(false);

  const coinDetails = useAppSelector((state) => state.token.userTokens);

  const dispatch = useAppDispatch();

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

  const resetFields = () => setTokenToAddDetails(initTokenDetail);

  const fetchSearchResults = async (query: any) => {
    if (searchLoading) return;
    setSearchLoading(true);
    try {
      const response = await coingeckoAxios.get(
        `/coins/list?include_platform=false` // https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd
      );
      const data: CoingeckoResult[] = await response.data;
      const filteredResults = data.filter((coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    } catch (error: any) {
      console.error("Error fetching search results:", error);
      // toast.error("Error fetching search results:");
      throw new Error(error);
    } finally {
      setSearchLoading(false);
    }
  };

  const removeUserToken = async (id: string | undefined) => {
    const loadingId = toast.loading("Deleting Token");

    try {
      if (id) {
        const res = await deleteToken(id);
        if (res.acknowledged === true) {
          toast.success("Deleted successfully", { id: loadingId });
          await mutate("fetchUserTokens");
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
      await mutate("fetchUserTokens");

      return newTokenAdded;
    } catch (error) {
      toast.error("Failed to add", { id: loadingId });
    }
  };

  const fetchUserTokens = async () => {
    if (coinsLoading) return;
    try {
      setCoinsLoading(true);
      const tokens = await getTokens(userId);

      dispatch(setUserTokens(tokens));
      return tokens;
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      throw new Error("Error fetching user tokens");
    } finally {
      setCoinsLoading(false);
    }
  };

  const fetchRealTimePrices = async (tokens: TokenData[]) => {
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
      if (status == 200) return data;
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

  const updateTokens = async (tokens: TokenData[], coingeckoResponse: any) => {
    return tokens.map((token) => {
      const realTimePrice = coingeckoResponse[token.coinId]?.usd || 0;
      const priceChange = coingeckoResponse[token.coinId]?.usd_24h_change || 0;

      return {
        ...token,
        price: realTimePrice,
        price_change_percentage_24h: priceChange,
      };
    });
  };

  const updatePricesAndSaveToDB = async () => {
    if (isUserTokensLoading) return;
    setUserTokensLoading(true); // Set update status to true

    if (!coinDetails) {
      throw new Error("CoinDetails is Undefined");
    }
    const toastId = toast.loading("Fetching Prices");

    try {
      const realTimePrices = await fetchRealTimePrices(coinDetails);

      const updatedUserTokens = await updateTokens(coinDetails, realTimePrices);

      const { data } = await axios.put(
        "/api/token",
        {
          data: { userId, updatedUserTokens },
        },
        { timeout: 20000 }
      );

      if (data.success) {
        await fetchUserTokens();
        toast.success("Prices Updated", { id: toastId });
      } else {
        toast.error("Failed to fetch prices", { id: toastId });
      }
      return data;
    } catch (error) {
      console.log("Error updating prices:", error);

      toast.error("Network Error. Try again later", { id: toastId });
    } finally {
      setUserTokensLoading(false);
    }
  };

  const { isLoading } = useSWRImmutable("fetchUserTokens", fetchUserTokens);
  useSWR(
    coinDetails ? "updatePricesAndSaveToDB" : null,
    updatePricesAndSaveToDB,
    {
      revalidateOnFocus: false,
      refreshInterval: 3 * 60000,
      errorRetryInterval: 0,
      revalidateIfStale: false,
    }
  );

  if (isLoading) return <MutatingDots height="100" width="100" />;

  return (
    <div className="max-w-[380px] md:max-w-full rounded-lg">
      <table className="md:w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-black dark:text-primary uppercase border-b border-gray-600 w-full ">
          <tr className="">
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
          {coinDetails &&
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
                  {formatPrice(coin.amount * coin.price, "USD")}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") addUserTokens();
                }}
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
              {formatPrice(
                tokenToAddDetails.amount * tokenToAddDetails.price,
                "USD"
              )}
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
      {showSearch && (
        <Backdrop isOpen={showSearch}>
          <SearchResultModal
            search={searchResults}
            tokenToAddDetails={tokenToAddDetails}
            setTokenToAddDetails={setTokenToAddDetails}
            showModal={showSearch}
            setShowModal={setShowSearch}
            searchLoading={searchLoading}
          />
        </Backdrop>
      )}
    </div>
  );
};

export default Table;
