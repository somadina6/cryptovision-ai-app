import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

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

        const { error } = await supabase.from("tokens").upsert(
          tokens.map((token) => ({
            token_id: token.id,
            symbol: token.symbol,
            name: token.name,
            image: token.image,
            current_price: token.current_price,
            price_change_24h: token.price_change_24h,
            price_change_percentage_24h: token.price_change_percentage_24h,
            market_cap: token.market_cap,
            market_cap_rank: token.market_cap_rank,
            circulating_supply: token.circulating_supply,
            total_supply: token.total_supply,
            max_supply: token.max_supply,
            ath: token.ath,
            ath_date: token.ath_date,
            atl: token.atl,
            atl_date: token.atl_date,
            last_updated: token.last_updated,
          })),
          { onConflict: "token_id" }
        );

        if (error) throw error;

        totalProcessed += tokens.length;
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
