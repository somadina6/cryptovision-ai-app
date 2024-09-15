import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userPortfolioSchema = new Schema(
  {
    userId: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indexing for better query performance
    },
    holdings: [
      {
        token: {
          type: Schema.ObjectId, // Reference to the Token model
          ref: "Token",
          required: true,
          index: true, // Indexing for efficient queries
        },
        amount: {
          type: Number,
          required: true,
          min: [0, "Quantity cannot be negative"], // Enforcing non-negative values
        },
        last_updated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

export const UserPortfolioModel =
  models.UserPortfolio || model("UserPortfolio", userPortfolioSchema);
