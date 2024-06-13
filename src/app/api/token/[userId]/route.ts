import TokenModel from "@/models/token";
import { TokenData } from "@/types/types";
import connect from "@/utils/mongodb/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string | undefined } }
) {
  const { userId } = params;

  if (
    !userId ||
    userId === undefined ||
    userId === null ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return NextResponse.json({ message: "User Is Invalid" }, { status: 500 });
  }

  try {
    await connect();
    const userTokens = await TokenModel.find<TokenData>({ userId });
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
