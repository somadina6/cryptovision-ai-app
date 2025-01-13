import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function getUserIdFromToken(request: NextRequest) {
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

    // Get session from Supabase auth
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // If no session, return error
    if (!session) {
      return { error: "No session found", userId: null };
    }

    return { error: null, userId: session.user.id };
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return { error: "Failed to authenticate request", userId: null };
  }
}
