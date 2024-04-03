"use client";
import { FormEvent, useContext, useState } from "react";
import { ThemeContext } from "@/context/themeContext";
import HomePage from "@/components/HomePage/HomePage";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthPage() {
  const { data: session, status } = useSession();
  return (
    <div>
      <p>Status:{status}</p>
      <p>{session?.user?.name}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
