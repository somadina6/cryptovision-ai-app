
import { getTokenDataFromDB } from "@/utils/apis/db.apis";
import { getUserIdFromToken } from "@/utils/auth/auth.utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { error, userId, message, statusCode } = await getUserIdFromToken(req);

  if (error || !userId) {
    return NextResponse.json({ message }, { status: statusCode });
  }

  try {
    const tokenId = (await params).tokenId;
    const portfolio = await getTokenDataFromDB({ tokenId });
    return NextResponse.json(portfolio, { status: 200, statusText: "OK" });
  } catch (error) {
    console.log(error);
    if (error instanceof Error && error.message === "Token not found") {
      return NextResponse.json(
        { message: "Token not found" },
        { status: 404, statusText: "Not Found" }
      );
    }
    return NextResponse.json(
      { message: "Failed to retrieve tokens" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
