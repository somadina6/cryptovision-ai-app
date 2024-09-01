import { setUserTokens } from "../../store/features/tokenSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getTokens } from "../../utils/apis/apis";
import { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

const LoadUserData = () => {
  const { userId } = useAppSelector((state) => state.user);
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

  // SWR for initial token fetch
  useSWRImmutable(userId ? "fetchUserTokens" : null, fetchUserTokens);

  useEffect(() => {
    fetchUserTokens();
  }, []);

  return null;
};

export default LoadUserData;
