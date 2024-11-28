import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.alternative.me/fng/", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Fear & Greed Index");
    }

    const data = await response.json();

    // Extract the latest Fear & Greed Index value
    const index = data?.data?.[0]?.value || null; // Assuming API provides data like [{value: 45, ...}]
    const level = data?.data?.[0]?.value_classification || null;
    const timestamp = data?.data?.[0]?.timestamp || null;
    console.log("Fear & Greed Index:", index, level, timestamp);
    return NextResponse.json({ index, level, timestamp });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve Fear & Greed Index" },
      { status: 500 }
    );
  }
}
