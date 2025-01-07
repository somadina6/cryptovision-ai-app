import OpenAI from "openai";
import { Redis } from "@upstash/redis";

// OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache duration constants
export const CACHE_DURATIONS = {
  PORTFOLIO_ANALYSIS: 1800, // 30 minutes
  TOKEN_SENTIMENT: 3600, // 1 hour
  MARKET_DATA: 300, // 5 minutes
} as const;
