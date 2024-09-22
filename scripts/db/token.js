"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var model = mongoose_1.default.model, models = mongoose_1.default.models;
// Define the schema for the Token model
var TokenSchema = new mongoose_2.Schema({
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
var TokenModel = models.Token || model("Token", TokenSchema);
exports.default = TokenModel;
