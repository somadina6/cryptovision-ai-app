import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const tokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  price: {
    required: true,
    type: Number,
  },
  image: {
    type: String,
  },
  coinId: {
    type: String,
    required: true,
  },
});

const TokenModel = models.Token || model("Token", tokenSchema);

export default TokenModel;
