"use client";
import useTokens from "@/lib/useTokens";
import { setUserTokens } from "@/store/features/tokenSlice";
import {
  setUserId,
  setUserImage,
  setUserName,
  setUserStatus,
} from "../../store/features/userSlice";
import { store } from "../../store/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, memo } from "react";
import { Provider, useDispatch } from "react-redux";

type Props = {
  children: React.ReactNode;
};

const UserComp = memo(() => {
  const dispatch = useDispatch();
  const { data, status } = useSession();
  const router = useRouter();
  const { tokens, error, isLoading } = useTokens(); // Assuming these states exist in useTokens
  const coinDetails = tokens || [];

  // Update user state in store based on session status
  const updateUserState = useCallback(() => {
    dispatch(setUserStatus(status));

    if (status === "authenticated" && data) {
      dispatch(setUserId(data.user.id));
      dispatch(setUserImage(data.user.image));
      dispatch(setUserName(data.user.name));
    } else if (status === "unauthenticated") {
      dispatch(setUserId(null));
      dispatch(setUserImage(null));
      dispatch(setUserName(null));
      router.push("/auth/login");
    }
  }, [status, data, dispatch, router]);

  useEffect(() => {
    updateUserState();
  }, [status, updateUserState]);

  // Update user tokens in store when fetched from API call
  useEffect(() => {
    if (coinDetails.length > 0 && !isLoading) {
      dispatch(setUserTokens(coinDetails));
    }
  }, [coinDetails, isLoading, error, dispatch]);

  return null;
});

UserComp.displayName = "UserComp";

const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <UserComp />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
