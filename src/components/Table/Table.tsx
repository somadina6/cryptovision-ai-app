"use client";
import "./styles.css";
import { addToken, deleteToken, formatPrice } from "@/utils/apis/apis";
import React, { FC, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch, CiTrash } from "react-icons/ci";
import { mutate } from "swr";
import SearchResultModal from "./SearchResultModal";
import Image from "next/image";
import Backdrop from "../Backdrop/Backdrop";
import { CoingeckoResult, TokenData } from "@/types/types";
import { useAppSelector } from "@/store/hooks";

import { coingeckoAxios } from "@/utils/axios/axios";
import LoadUserData from "../LoadUserData/LoadUserData";

const inputStyles =
  "block w-full p-2 h-full text-md border-none rounded-md dark:text-black";

const Table: FC<{ userId: string }> = ({ userId }) => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<CoingeckoResult[]>();
  const [searchLoading, setSearchLoading] = useState(false);

  const coinDetails = useAppSelector((state) => state.token.userTokens);

  const initTokenDetail: TokenData = {
    userId,
    coinId: "",
    name: "",
    symbol: "",
    amount: 0,
    price: 0,
    image: "",
    price_change_percentage_24h: 0,
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
    } catch (error) {
      toast.error("Failed to delete", { id: loadingId });
    }
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

  return (
    <div className="max-w-[380px] md:max-w-full rounded-lg">
      <LoadUserData />
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
