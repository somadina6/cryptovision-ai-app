// // import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "@supabase/supabase-js";

// function requireString(value: unknown, field: string): string {
//   if (typeof value !== "string" || !value) {
//     throw new Error(`Missing or invalid ${field}`);
//   }
//   return value;
// }

// function requireNumber(value: unknown, field: string): number {
//   if (typeof value !== "number" || isNaN(value)) {
//     throw new Error(`Missing or invalid ${field}`);
//   }
//   return value;
// }

// function optionalNumber(value: unknown): number | null {
//   if (value === null || value === undefined) return null;
//   if (typeof value !== "number" || isNaN(value)) return null;
//   return value;
// }

// const supabase = createClient(
//   Deno.env.get("SUPABASE_URL") ?? "",
//   Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
// );

// const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";
// const DELAY_MS = 1000;
// const PAGE_LIMIT = 100;

// const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Deno.serve(async () => {
//   try {
//     let page = 1;
//     let totalProcessed = 0;
//     const numberOfTokensToProcess = 1800;

//     while (totalProcessed < numberOfTokensToProcess) {
//       try {
//         const response = await fetch(
//           `${COINGECKO_API}?vs_currency=usd&order=market_cap_desc&per_page=${PAGE_LIMIT}&page=${page}&sparkline=false`
//         );

//         if (response.status === 429) {
//           const retryAfter = response.headers.get("retry-after");
//           const retryMs = (retryAfter ? parseInt(retryAfter) : 60) * 1000;
//           console.log(`Rate limited. Waiting ${retryMs / 1000} seconds...`);
//           await sleep(retryMs);
//           continue;
//         }

//         const tokens = await response.json();
//         if (!tokens.length) break;

//         const validTokens = tokens
//           .map((token: any) => {
//             try {
//               return {
//                 // Required string fields
//                 token_id: requireString(token.id, "token_id"),
//                 symbol: requireString(token.symbol, "symbol"),
//                 name: requireString(token.name, "name"),
//                 image: requireString(token.image, "image"),

//                 // Required numeric fields
//                 current_price: requireNumber(
//                   token.current_price,
//                   "current_price"
//                 ),
//                 market_cap: requireNumber(token.market_cap, "market_cap"),

//                 // Optional numeric fields
//                 price_change_24h: optionalNumber(token.price_change_24h),
//                 price_change_percentage_24h: optionalNumber(
//                   token.price_change_percentage_24h
//                 ),
//                 market_cap_rank: optionalNumber(token.market_cap_rank),
//                 circulating_supply: optionalNumber(token.circulating_supply),
//                 total_supply: optionalNumber(token.total_supply),
//                 max_supply: optionalNumber(token.max_supply),
//                 ath: optionalNumber(token.ath),
//                 atl: optionalNumber(token.atl),

//                 // Date fields
//                 ath_date: token.ath_date,
//                 atl_date: token.atl_date,
//                 last_updated: requireString(token.last_updated, "last_updated"),
//               };
//             } catch (error: unknown) {
//               if (error instanceof Error) {
//                 console.error(`Skipping invalid token:`, error.message);
//               } else {
//                 console.error(`Skipping invalid token: Unknown error`);
//               }
//               return null;
//             }
//           })
//           .filter(Boolean); // Remove any null entries

//         if (validTokens.length === 0) {
//           console.log(`No valid tokens found on page ${page}, skipping`);
//           continue;
//         }

//         const { error } = await supabase
//           .from("tokens")
//           .upsert(validTokens, { onConflict: "token_id" });

//         if (error) {
//           console.error("Database error:", error);
//           throw error;
//         }

//         totalProcessed += tokens.length;
//         page++;

//         // Add delay to avoid rate limiting
//         await sleep(DELAY_MS);
//       } catch (error) {
//         console.error(`Error processing page ${page}:`, error);
//         throw error;
//       }
//     }

//     return new Response(
//       JSON.stringify({
//         message: `Successfully processed ${totalProcessed} tokens`,
//       }),
//       { headers: { "Content-Type": "application/json" } }
//     );
//   } catch (error) {
//     console.error("Function error:", error);
//     return new Response(JSON.stringify({ error: "Failed to update tokens" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// });

// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/update-tokens' \
//     --header 'Authorization: Bearer ' \
//     --header 'Content-Type: application/json' \
//     --data '{"name":"Functions"}'

// */
