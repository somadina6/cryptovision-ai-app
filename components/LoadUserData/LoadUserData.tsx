"use client";
import { setUserTokens } from "../../store/features/tokenSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchRealTimePrices,
  getTokens,
  updateTokens,
} from "../../utils/apis/apis";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

const LoadUserData = () => {
  const [isUserTokensLoading, setUserTokensLoading] = useState(false);

  const { userId } = useAppSelector((state) => state.user);
  const coinDetails = useAppSelector((state) => state.token.userTokens);

  const dispatch = useAppDispatch();

  // Fetch User Tokens From DB
  const fetchUserTokens = async () => {
    if (!userId) return;
    try {
      const tokens = await getTokens(userId);
      dispatch(setUserTokens(tokens));
      return tokens;
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      throw new Error("Error fetching user tokens");
    }
  };

  // Update Prices and Save to DB
  const updatePricesAndSaveToDB = async () => {
    if (isUserTokensLoading || !coinDetails) return;
    setUserTokensLoading(true);

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
        throw new Error();
      }
      return data;
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Network Error. Try again later", { id: toastId });
    } finally {
      setUserTokensLoading(false);
    }
  };

  // SWR for initial token fetch
  const { isLoading } = useSWRImmutable(
    userId ? "fetchUserTokens" : null,
    fetchUserTokens
  );

  // SWR for periodic price update
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

  return <div></div>;
};

export default LoadUserData;
