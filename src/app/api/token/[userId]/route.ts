import TokenModel from "@/models/token";
import { TokenData } from "@/utils/apis/apis";
import connect from "@/utils/mongodb/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connect();
    const { userId } = params;
    // console.log(userId);
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
