import sanityClient from "@/utils/sanity/client";
import { signUpHandler } from "next-auth-sanity";

export const POST = signUpHandler(sanityClient);
