import { getUserIdFromToken } from "@/utils/auth/auth.utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  

  const ecburl = process.env.NEXT_PUBLIC_ECB_API_URL;
  if (!ecburl) throw new Error("Fetch URL Not Available");

  try {
    const { data, status, statusText } = await axios.get(ecburl);

    if (status !== 200)
      throw new Error(`${statusText} Failed to fetch exchange rates`);

    if (!data || !data.usd) throw new Error("Invalid response");

    if (status === 200) return NextResponse.json(data.usd, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch exchange rates" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
