import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Utility function to extract and validate the user token
export async function getUserIdFromToken(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token || !token.sub) {
      return { error: true, message: "Unauthorized", statusCode: 401 };
    }

    const userId = token.id as string;

    if (!userId) {
      return { error: true, message: "Unauthorized", statusCode: 401 };
    }

    return { error: false, userId, statusCode: 200 };
  } catch (err) {
    console.error("Token extraction error:", err);
    return { error: true, message: "Internal Server Error", statusCode: 500 };
  }
}
