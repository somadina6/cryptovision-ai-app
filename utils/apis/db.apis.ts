// Custom CRUD operations for the database
import mongoose from "mongoose";
import { UserPortfolioModel } from "../../models/userPortfolio";
import connect from "../mongodb/db";
const { Schema } = mongoose;

import TokenModel from "@/models/token";

type Holding = {
  token: mongoose.Types.ObjectId;
  amount: number;
  last_updated?: Date;
};

export async function addTokenToDB(params: {
  userId: string;
  tokenId: string;
  amount: number;
}) {
  const { userId, tokenId, amount } = params;

  if (!userId || !tokenId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("User Is Invalid");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const tokenObjectId = new mongoose.Types.ObjectId(tokenId);

  // Validate the amount
  if (amount < 0) throw new Error("Quantity cannot be negative");

  await connect();

  // Find the user's portfolio
  const existingUserPortfolio = await UserPortfolioModel.findOne({
    userId: userObjectId,
  });

  if (existingUserPortfolio) {
    // Check if the token already exists in the user's holdings
    const existingToken = existingUserPortfolio.holdings.find(
      (holding: Holding) => holding.token === tokenObjectId
    );

    if (existingToken) {
      // Update quantity and last_updated timestamp
      existingToken.amount = amount;
      existingToken.last_updated = new Date();
    } else {
      // Add a new token to holdings
      existingUserPortfolio.holdings.push({
        token: tokenObjectId, // No conversion to ObjectId needed
        amount: amount,
        last_updated: new Date(),
      });
    }

    await existingUserPortfolio.save();
    console.log("Portfolio updated");
    return { portfolio: existingUserPortfolio, status: 200 };
  } else {
    // If the user portfolio does not exist, create a new one
    console.log("Creating new portfolio");
    console.log("userObjectId", userId);
    console.log("tokenId", tokenId);
    console.log("quantity", amount);
    const newPortfolio = await UserPortfolioModel.create({
      userId: userId,
      holdings: [
        {
          token: tokenObjectId,
          amount: amount,
          last_updated: new Date(),
        },
      ],
    });

    return { portfolio: newPortfolio, status: 201 };
  }
}

export async function getTokensFromDB(userId: string) {
  try {
    await connect();
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Populate the 'holdings' array and the 'token_id' field within 'holdings'
    const userPortfolio = await UserPortfolioModel.findOne({
      userId: userObjectId,
    }).populate({
      path: "holdings",
      populate: {
        path: "token",
        select:
          "_id id symbol name image current_price price_change_percentage_24h",
      },
    });

    if (!userPortfolio) {
      throw new Error("User Portfolio Not Found");
    }
    return userPortfolio.holdings;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
}

export async function deleteTokenFromDB(params: {
  userId: string;
  tokenId: string;
}) {
  const { userId, tokenId } = params;

  if (!userId || !tokenId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("User Is Invalid");
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const tokenObjectId = new mongoose.Types.ObjectId(tokenId);

  await connect();

  const userPortfolio = await UserPortfolioModel.findOne({
    userId: userObjectId,
  });

  if (!userPortfolio) {
    throw new Error("User Portfolio Not Found");
  }

  userPortfolio.holdings = userPortfolio.holdings.filter(
    (holding: Holding) => holding.token.toString() !== tokenObjectId.toString()
  );

  await userPortfolio.save();

  return userPortfolio.holdings;
}
