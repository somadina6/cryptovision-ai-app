"use client";
import { SWRConfig, SWRConfiguration } from "swr";

type Props = {
  children: React.ReactNode;
};

const options: SWRConfiguration = {
  provider: () => new Map(),
  refreshInterval: 1800000, // 30 minutes
  dedupingInterval: 10000, // 10 seconds
  revalidateOnFocus: false,
};

export default function SWRConfigProvider({ children }: Props) {
  return <SWRConfig value={options}>{children}</SWRConfig>;
}
