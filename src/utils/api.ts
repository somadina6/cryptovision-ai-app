import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";

export async function getCsrfToken_(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return csrfToken;
}
