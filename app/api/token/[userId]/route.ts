import TokenModel from "../../../../models/token";
import { UserPortfolioModel } from "../../../../models/userPortfolio";
import { addTokenToDB, getTokensFromDB } from "../../../../utils/apis/db.apis";
import connect from "../../../../utils/mongodb/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
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

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { tokenId, amount }: { tokenId: string; amount: number } =
      await req.json();
    const { userId } = params;

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

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    await connect();
    const { tokenId } = body;

    const userToken = await TokenModel.deleteOne({
      _id: tokenId,
    });

    console.log(userToken);
    return NextResponse.json(userToken, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Unable to Fetch" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();
  await connect();
  const { userId, updatedUserTokens } = body.data;

  try {
    // Loop through updatedTokens and update each token in the database
    for (const token of updatedUserTokens) {
      // Find the token by userId and coinId
      const existingToken = await TokenModel.findOne({
        userId,
        coinId: token.coinId,
      });

      if (existingToken) {
        // Update the token price
        existingToken.price = token.price;
        existingToken.price_change_percentage_24h =
          token.price_change_percentage_24h;

        // Save the updated token
        await existingToken.save();
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating user tokens:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
