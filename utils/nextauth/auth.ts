import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "../mongodb/db";

import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../mongodb/client";
import userModel, { IUser } from "../../models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOODLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // SanityCredentials(sanityClient),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        // console.log(credentials);

        if (!credentials) {
          console.log("No Credentials!");
          return null;
        }
        try {
          const exsitingUser = await userModel.findOne({
            email: credentials.email.toLowerCase(),
          });

          if (exsitingUser) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              exsitingUser.password
            );

            if (isPasswordCorrect) {
              console.log("Sign In - Success!");
              return {
                id: exsitingUser._id,
                email: exsitingUser.email,
                name: exsitingUser.name,
                image: exsitingUser.image,
              };
            }
          } else {
            // console.log(credentials);
            return null;
          }
          return null;
        } catch (err: any) {
          console.log(err);
          throw new Error(err);
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 30 * 60,
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const signInDate = new Date();
      console.log("Just Signed In At", signInDate.toLocaleDateString());
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token, user }) {
      return session;
    },
  },
};
