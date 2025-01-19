import { Database } from "./supabase";

// Table Row Types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Token = Database["public"]["Tables"]["tokens"]["Row"];
export type UserPortfolio =
  Database["public"]["Tables"]["user_portfolios"]["Row"];

// Insert Types
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type TokenInsert = Database["public"]["Tables"]["tokens"]["Insert"];
export type UserPortfolioInsert =
  Database["public"]["Tables"]["user_portfolios"]["Insert"];

// Update Types
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type TokenUpdate = Database["public"]["Tables"]["tokens"]["Update"];
export type UserPortfolioUpdate =
  Database["public"]["Tables"]["user_portfolios"]["Update"];

// Enum Types
export type UserRole = Database["public"]["Enums"]["user_role"];

// Custom Types
export type PortfolioWithToken = UserPortfolio & {
  token: Token;
};
