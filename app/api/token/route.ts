import {
  getTokensFromDB,
  addTokenToDB,
  deleteTokenFromDB,
  updateTokenInDB,
} from "@/utils/apis/db.apis";
import { getUserIdFromToken } from "@/utils/auth/auth.utils";
import connect from "@/utils/mongodb/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { error, userId, message, statusCode } = await getUserIdFromToken(req);

  if (error || !userId) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  try {
    console.log("User ID:", userId);
    const portfolio = await getTokensFromDB(userId);
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
  const { error, userId, message, statusCode } = await getUserIdFromToken(req);
  if (error || !userId) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  try {
    const { tokenId, amount }: { tokenId: string; amount: number } =
      await req.json();

    const data = await addTokenToDB({ userId, tokenId, amount });

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
  const { error, userId, message, statusCode } = await getUserIdFromToken(req);
  if (error || !userId) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  try {
    const { tokenId } = await req.json();
    await deleteTokenFromDB({ userId, tokenId });

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
      { message: "Unable to delete token", success: false },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { error, userId, message, statusCode } = await getUserIdFromToken(req);
  if (error || !userId) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  try {
    const { tokenId, amount } = await req.json();
    await connect();

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
