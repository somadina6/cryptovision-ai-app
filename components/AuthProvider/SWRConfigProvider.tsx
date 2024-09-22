"use client";
import { SWRConfig, SWRConfiguration } from "swr";

type Props = {
  children: React.ReactNode;
};

const options: SWRConfiguration = {
  provider: () => new Map(),
  refreshInterval: 900000, // 15 minutes
  dedupingInterval: 60000 * 5, // 5 minutes
  revalidateOnFocus: false,
};

export default function SWRConfigProvider({ children }: Props) {
  return <SWRConfig value={options}>{children}</SWRConfig>;
}
