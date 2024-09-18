"use client";
import { SWRConfig } from "swr";

type Props = {
  children: React.ReactNode;
};

export default function SWRConfigProvider({ children }: Props) {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  );
}
