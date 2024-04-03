import { GetServerSidePropsContext } from "next";
import { getCsrfToken } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  return new NextResponse(csrfToken, { status: 200 });
}
