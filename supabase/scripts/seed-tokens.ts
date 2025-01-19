import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { crypto } from "https://deno.land/std@0.204.0/crypto/mod.ts";

const COINGECKO_API = "https://api.coingecko.com/api/v3/coins/markets";

// Get values from Supabase config
const supabaseConfig = await Deno.readTextFile(".env");
const SUPABASE_URL = supabaseConfig.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1];
const SUPABASE_SERVICE_KEY = supabaseConfig.match(
  /SUPABASE_SERVICE_ROLE_KEY=(.*)/
)?.[1];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function generateUUID(): string {
  return crypto.randomUUID();
}

async function seedTokens() {
  try {
    const response = await fetch(
      `${COINGECKO_API}?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false&locale=en`
    );
    const tokens = await response.json();

    const { data, error } = await supabase.from("tokens").upsert(
      tokens.map((token: any) => ({
        id: generateUUID(),
        token_id: token.id,
        symbol: token.symbol,
        name: token.name,
        image: token.image,
        current_price: token.current_price,
        market_cap: token.market_cap,
        market_cap_rank: token.market_cap_rank,
        circulating_supply: token.circulating_supply,
        total_supply: token.total_supply,
        max_supply: token.max_supply,
        ath: token.ath,
        ath_date: token.ath_date,
        atl: token.atl,
        atl_date: token.atl_date,
        price_change_24h: token.price_change_24h,
        price_change_percentage_24h: token.price_change_percentage_24h,
        last_updated: token.last_updated,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "token_id" }
    );

    if (error) throw error;
    console.log(`Seeded ${tokens.length} tokens`);
  } catch (error) {
    console.error("Error seeding tokens:", error);
  }
}

await seedTokens();
