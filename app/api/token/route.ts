import { supabase } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: portfolio, error } = await supabase
      .from("user_portfolios")
      .select(
        `
        *,
        token:tokens(*)
      `
      )
      .eq("user_id", session.user.id);

    if (error) throw error;
    return NextResponse.json(portfolio, { status: 200 });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json(
      { message: "Failed to retrieve tokens" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { tokenId, amount }: { tokenId: string; amount: number } =
      await req.json();

    const { data, error } = await supabase
      .from("user_portfolios")
      .insert({
        user_id: session.user.id,
        token_id: tokenId,
        amount: amount,
      })
      .select(
        `
        *,
        token:tokens(*)
      `
      )
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error adding token:", error);
    return NextResponse.json(
      { message: "Failed to add token" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { tokenId, amount }: { tokenId: string; amount: number } =
      await req.json();

    const { data, error } = await supabase
      .from("user_portfolios")
      .update({ amount })
      .eq("user_id", session.user.id)
      .eq("token_id", tokenId)
      .select(
        `
        *,
        token:tokens(*)
      `
      )
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating token:", error);
    return NextResponse.json(
      { message: "Failed to update token" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { tokenId }: { tokenId: string } = await req.json();

    const { error } = await supabase
      .from("user_portfolios")
      .delete()
      .eq("user_id", session.user.id)
      .eq("token_id", tokenId);

    if (error) throw error;
    return NextResponse.json(
      { message: "Token deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting token:", error);
    return NextResponse.json(
      { message: "Failed to delete token" },
      { status: 500 }
    );
  }
}
