import { setUserTokens } from "@/store/features/tokenSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getTokens } from "@/utils/apis/apis";
import useSWR from "swr";

export const fetchUserTokens = async (userId: string) => {
  console.log("fetchUserTokens");

  try {
    const tokens = await getTokens();
    return tokens;
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    throw new Error("Error fetching user tokens");
  }
};

function useTokens() {
  const { data, isLoading, error } = useSWR(
    `fetchUserTokens`,
    fetchUserTokens,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    tokens: data,
    isLoading,
    error,
  };
}

export default useTokens;
