import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SanityAdapter, SanityCredentials } from "next-auth-sanity";
import sanityClient from "../sanity/client";
import connect from "../mongodb/db";
import userModel from "@/models/user";
import bcrypt from "bcryptjs";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../mongodb/client";

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
        console.log("About to Sign In");

        if (!credentials) {
          console.log("No Credentials!");
          return null;
        }
        try {
          const exsitingUser = await userModel.findOne({
            email: credentials.email,
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
            console.log(credentials);
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
  // adapter: SanityAdapter(sanityClient),
  // adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log(user, account);
      if (account?.provider == "credentials") return true;
      if (account?.provider == "google") {
        await connect();
        console.log("db connected");
        try {
          const existingUser = await userModel.findOne({ email: user.email });

          if (!existingUser) {
            console.log("Adding Google OAuth User to DB");

            const newUser = new userModel({
              email: user.email,
              name: user.name,
              image: user.image,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.log(err);
          console.log("Error Using Google Oauth");
          return false;
        }
      }
      return false;
    },
    async session({ session, token, user }) {
      // console.log(session, token, user);
      const userEmail = token.email;
      const userIdObject = await userModel.findOne({ email: userEmail });
      // console.log(userIdObject);
      return {
        ...session,
        user: {
          ...session.user,
          id: userIdObject._id,
        },
      };
    },
  },
};
