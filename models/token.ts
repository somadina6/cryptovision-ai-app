import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
const { model, models } = mongoose;

// Define the Token interface that extends Document (for typing purposes)
interface Token extends Document {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number | null;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_date: Date;
  atl: number;
  atl_date: Date;
  last_updated: Date;
}

// Define the schema for the Token model
const TokenSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  symbol: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  image: { type: String, required: true },
  current_price: { type: Number, required: true },
  price_change_24h: { type: Number, required: true },
  price_change_percentage_24h: { type: Number, required: true },
  market_cap: { type: Number, required: true, default: 0 },
  market_cap_rank: { type: Number, default: null },
  circulating_supply: { type: Number, required: true },
  total_supply: { type: Number, required: true },
  max_supply: { type: Number, default: null },
  ath: { type: Number, required: true },
  ath_date: { type: Date, required: true },
  atl: { type: Number, required: true },
  atl_date: { type: Date, required: true },
  last_updated: { type: Date, required: true },
});

const TokenModel = model("Token", TokenSchema);

export default TokenModel;
