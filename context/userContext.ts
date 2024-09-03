"use client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, createContext } from "react";

type UserContextType = {
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
};

export const UserContext = createContext<UserContextType>({
  userId: "",
  setUserId: () => null,
});
