import TokenModel from "../../../../models/token";
import { UserPortfolioModel } from "../../../../models/userPortfolio";
import { TokenData } from "../../../../types/types";
import connect from "../../../../utils/mongodb/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "User Is Invalid" }, { status: 500 });
  }

  try {
    await connect();
    // const userTokens = await TokenModel.find<TokenData>({ userId });
    const userTokens = await UserPortfolioModel.findOne({ userId }).populate(
      "holdings.token_id"
    );
    // console.log(userTokens);
    return NextResponse.json(userTokens, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to retrieve tokens" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "User Is Invalid" }, { status: 500 });
  }

  try {
    const { tokenId, quantity }: { tokenId: string; quantity: number } =
      await req.json();
    await connect();

    const result = await UserPortfolioModel.create({
      userId,
      holdings: [{ token_id: tokenId, quantity: quantity }],
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Unable to Fetch" }, { status: 400 });
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
