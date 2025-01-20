import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

console.log("Hello from Functions!");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";
const DELAY_MS = 1000;
const PAGE_LIMIT = 100;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to ensure required string fields are never null
const requireString = (value: any, fieldName: string): string => {
  if (value === null || value === undefined) {
    throw new Error(`Required field ${fieldName} is missing`);
  }
  return String(value);
};

// Helper function to ensure required numeric fields are never null
const requireNumber = (value: any, fieldName: string): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    throw new Error(`Required field ${fieldName} is missing or invalid`);
  }
  return Number(value);
};

// Helper function for optional numeric fields
const optionalNumber = (value: any): number | null => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return null;
  }
  return Number(value);
};

serve(async (req) => {
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
          .map((token: any) => {
            try {
              return {
                // Required string fields
                token_id: requireString(token.id, 'token_id'),
                symbol: requireString(token.symbol, 'symbol'),
                name: requireString(token.name, 'name'),
                image: requireString(token.image, 'image'),
                
                // Required numeric fields
                current_price: requireNumber(token.current_price, 'current_price'),
                market_cap: requireNumber(token.market_cap, 'market_cap'),
                
                // Optional numeric fields
                price_change_24h: optionalNumber(token.price_change_24h),
                price_change_percentage_24h: optionalNumber(token.price_change_percentage_24h),
                market_cap_rank: optionalNumber(token.market_cap_rank),
                circulating_supply: optionalNumber(token.circulating_supply),
                total_supply: optionalNumber(token.total_supply),
                max_supply: optionalNumber(token.max_supply),
                ath: optionalNumber(token.ath),
                atl: optionalNumber(token.atl),
                
                // Date fields
                ath_date: token.ath_date,
                atl_date: token.atl_date,
                last_updated: requireString(token.last_updated, 'last_updated'),
              };
            } catch (error) {
              console.error(`Skipping invalid token:`, error.message);
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
        console.log(
          `Page ${page} processed. Total processed: ${totalProcessed}`
        );

        page++;
        await sleep(DELAY_MS);
      } catch (error) {
        console.error("Error processing page:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack
        });
        throw error;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully processed ${totalProcessed} tokens`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});