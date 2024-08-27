import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userPortfolioSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  holdings: [
    {
      token_id: {
        type: mongoose.Types.ObjectId,
        ref: "Token",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      last_updated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const UserPortfolioModel =
  models.UserPortfolio || model("UserPortfolio", userPortfolioSchema);
