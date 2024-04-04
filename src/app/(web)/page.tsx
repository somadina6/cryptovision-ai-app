"use client";
import { FormEvent, useContext, useState } from "react";
import { ThemeContext } from "@/context/themeContext";
import HomePage from "@/components/HomePage/HomePage";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const { data: session, status } = useSession();
  console.log("session:\n", session);
  return (
    <div>
      <p>Status:{status}</p>
      <p>{session?.user?.name}</p>
      <button
        onClick={() => {
          signOut();
        }}
      >
        Sign Out
      </button>
      <button
        onClick={() => {
          toast("TT");
        }}
      >
        SS
      </button>
    </div>
  );
}
