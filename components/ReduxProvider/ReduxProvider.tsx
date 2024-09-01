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
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hooks";

type Props = {
  children: React.ReactNode;
};

const UserComp = () => {
  const dispatch = useDispatch();
  const { data, status } = useSession();
  const router = useRouter();

  const { userId } = useAppSelector((state) => state.user);
  console.log("useTokens from ReduxProvider");
  const { tokens: coinDetails } = useTokens(userId ?? "");

  useEffect(() => {
    if (coinDetails) {
      dispatch(setUserTokens(coinDetails));
      console.log("ReduxProvider dispatch setUserTokens");
    }
  }, [coinDetails]);

  useEffect(() => {
    const userStateCheck = async () => {
      dispatch(setUserStatus(status));

      switch (status) {
        case "authenticated":
          dispatch(setUserId(data.user.id));
          dispatch(setUserImage(data.user.image));
          dispatch(setUserName(data.user.name));
          break;

        case "unauthenticated":
          dispatch(setUserId(null));
          dispatch(setUserImage(null));
          dispatch(setUserName(null));
          break;

        default:
          break;
      }
    };
    userStateCheck();
  }, [status, data, dispatch]);

  if (status == "unauthenticated") {
    router.push("/auth/login");
  }

  return null;
};

const ReduxProvider = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <UserComp />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
