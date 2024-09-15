import {
  getTokensFromDB,
  addTokenToDB,
  deleteTokenFromDB,
  updateTokenInDB,
} from "@/utils/apis/db.apis";
import connect from "@/utils/mongodb/db";
import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    const id = token.id as string;
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    console.log("User ID:", id);
    const portfolio = await getTokensFromDB(id);
    return NextResponse.json(portfolio, { status: 200, statusText: "OK" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to retrieve tokens" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    const id = token.id as string;
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    console.log("User ID:", id);
    const { tokenId, amount }: { tokenId: string; amount: number } =
      await req.json();

    const data = await addTokenToDB({ userId: id, tokenId, amount });

    return NextResponse.json(data, { status: 200, statusText: "OK" });
  } catch (err: any) {
    console.error("Error updating user portfolio:", err);
    return NextResponse.json(
      { message: "Unable to update portfolio", error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    const id = token.id as string;
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    console.log("User ID:", id);
    const { tokenId } = await req.json();

    await deleteTokenFromDB({ userId: id, tokenId });

    return NextResponse.json(
      {
        message: "Token deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Unable to Fetch", success: false },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    await connect();
    // Get token from request
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    // Get user ID from token
    const userId = token.id as string;
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401, statusText: "Unauthorized" }
      );
    }
    // Get token ID and amount from request body
    const { tokenId, amount } = body;

    const data = await updateTokenInDB({ userId, tokenId, amount });
    if (data) {
      return NextResponse.json(data, { status: 200, statusText: "OK" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update token" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
