// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

console.log("Hello from Functions!");

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";
const DELAY_MS = 1000;
const PAGE_LIMIT = 100;

// Helper function to delay between requests
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

Deno.serve(async (req) => {
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
          tokens.map((token: any) => ({
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
        console.log(
          `Page ${page} processed. Total processed: ${totalProcessed}`
        );

        page++;
        await sleep(DELAY_MS);
      } catch (error) {
        console.error("Error processing page:", error);
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

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-tokens' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
