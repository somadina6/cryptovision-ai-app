import axios from "axios";

export const coingeckoAxios = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
});
