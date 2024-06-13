import TokenModel from "@/models/token";
import { TokenData } from "@/types/types";
import connect from "@/utils/mongodb/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userTokenData }: { userTokenData: TokenData } = await req.json();
    await connect();
    console.log(userTokenData);
    // const { userId, name, symbol, price, amount, image } = userTokenData;

    const userToken: TokenData = await TokenModel.create<TokenData>(
      userTokenData
    );

    console.log(userToken);
    return NextResponse.json(userToken, { status: 200 });
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
