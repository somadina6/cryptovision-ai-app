import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const { data, status } = await axios.get("https://api.alternative.me/fng/");
    if (status === 200) {
      // Extract the latest Fear & Greed Index value
      const index = data?.data?.[0]?.value || null; // Assuming API provides data like [{value: 45, ...}]
    const level = data?.data?.[0]?.value_classification || null;
      const timestamp = data?.data?.[0]?.timestamp || null;
      console.log("Fear & Greed Index:", index, level, timestamp);
      return NextResponse.json({ index, level, timestamp });
    }
    return NextResponse.json(
      { error: "Failed to retrieve Fear & Greed Index" },
      { status: 500 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve Fear & Greed Index" },
      { status: 500 }
    );
  }
}
