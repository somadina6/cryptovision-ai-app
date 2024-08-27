import mongoose from "mongoose";

const { model, models } = mongoose;

const TokenModel = models.Token || model("Token");

export default TokenModel;
