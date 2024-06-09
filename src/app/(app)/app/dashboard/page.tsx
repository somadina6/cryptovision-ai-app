"use client";
import { setUserTokens } from "@/store/features/tokenSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatPrice, getTokens } from "@/utils/apis/apis";
import { useEffect } from "react";
import { mutate } from "swr";

const Page = () => {
  const { name, userId } = useAppSelector((state) => state.user);

  const { sum, change_24hr } = useAppSelector((state) => state.token);
  const dispatch = useAppDispatch();

  const firstName = name ? name.split(" ")[0] : "User";

  useEffect(() => {
    const fetchUserTokens = async () => {
      console.log("fetching from DB");
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
    fetchUserTokens();
  }, [userId]);

  return (
    <div>
      <div>
        <h3>Welcome {firstName}!</h3>
        <h4>
          Your {formatPrice(sum, "USD")} portfolio is{" "}
          {change_24hr > 0 ? "up" : "down"} by {change_24hr.toFixed(2)}%
        </h4>
      </div>
    </div>
  );
};

export default Page;
