import connectToDatabase from "../../../../../utils/mongodb/connection";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  const query = params.query;
  console.log("Query:", query);

  try {
    const db = await connectToDatabase();
    const tokensCollection = db.collection("tokens");

    const queryToDB = {
      $or: [
        { symbol: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    };

    const results = await tokensCollection
      .find(queryToDB)
      .sort({ market_cap_rank: 1 })
      .toArray();

    console.log("Query Results:", results);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to retrieve tokens" },
      { status: 500 }
    );
  }
}
