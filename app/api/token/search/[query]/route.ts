import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  const query = params.query;

  try {
    // Create server-side Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: results, error } = await supabase
      .from("tokens")
      .select()
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%`)
      .order("market_cap_rank", { ascending: true })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(results || [], { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Failed to search tokens" },
      { status: 500 }
    );
  }
}
