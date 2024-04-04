import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import { sanityClient } from "../sanity/client";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOODLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    SanityCredentials(sanityClient),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: SanityAdapter(sanityClient),
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
  },
};
