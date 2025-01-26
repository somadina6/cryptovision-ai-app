#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { config } from "dotenv";

// Load environment variables from .env file
config();

// Validation helper functions
const requireString = (value, fieldName) => {
  if (typeof value !== "string" || !value) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
  return value;
};

const requireNumber = (value, fieldName) => {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return value;
};

const optionalNumber = (value) => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";
const PAGE_LIMIT = 100;
const DELAY_MS = 1000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to delay between requests
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function updateTokens() {
  try {
    let page = 1;
    let totalProcessed = 0;
    const numberOfTokensToProcess = 1800;

    while (totalProcessed < numberOfTokensToProcess) {
      try {
        const response = await fetch(
          `${COINGECKO_API}?vs_currency=usd&order=market_cap_desc&per_page=${PAGE_LIMIT}&page=${page}&sparkline=false`
        );

        if (response.status === 429) {
          const retryAfter = response.headers.get("retry-after");
          const retryMs = (retryAfter ? parseInt(retryAfter) : 60) * 1000;
          console.log(`Rate limited. Waiting ${retryMs / 1000} seconds...`);
          await sleep(retryMs);
          continue;
        }

        const tokens = await response.json();
        if (!tokens.length) break;

        const validTokens = tokens
          .map((token) => {
            try {
              return {
                // Required string fields
                token_id: requireString(token.id, "token_id"),
                symbol: requireString(token.symbol, "symbol"),
                name: requireString(token.name, "name"),
                image: requireString(token.image, "image"),

                // Required numeric fields
                current_price: requireNumber(
                  token.current_price,
                  "current_price"
                ),
                market_cap: requireNumber(token.market_cap, "market_cap"),

                // Optional numeric fields
                price_change_24h: optionalNumber(token.price_change_24h),
                price_change_percentage_24h: optionalNumber(
                  token.price_change_percentage_24h
                ),
                market_cap_rank: optionalNumber(token.market_cap_rank),
                circulating_supply: optionalNumber(token.circulating_supply),
                total_supply: optionalNumber(token.total_supply),
                max_supply: optionalNumber(token.max_supply),
                ath: optionalNumber(token.ath),
                atl: optionalNumber(token.atl),

                // Date fields
                ath_date: token.ath_date,
                atl_date: token.atl_date,
                last_updated: requireString(token.last_updated, "last_updated"),
              };
            } catch (error) {
              console.error(`Skipping invalid token: ${error.message}`);
              return null;
            }
          })
          .filter(Boolean); // Remove any null entries

        if (validTokens.length === 0) {
          console.log(`No valid tokens found on page ${page}, skipping`);
          continue;
        }

        const { error } = await supabase
          .from("tokens")
          .upsert(validTokens, { onConflict: "token_id" });

        if (error) {
          console.error("Database error:", error);
          throw error;
        }

        totalProcessed += validTokens.length;
        console.log(`Processed ${totalProcessed} tokens`);
        page++;

        // Add delay to avoid rate limiting
        await sleep(DELAY_MS);
      } catch (error) {
        console.error(`Error processing page ${page}:`, error);
        throw error;
      }
    }

    console.log(`Successfully processed ${totalProcessed} tokens`);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

updateTokens();
