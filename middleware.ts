// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req: NextRequest) {
    console.log(req.method, req.url);
  },

  {
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      newUser: "/auth/signup",
    },
  }
);

export const config = { matcher: ["/api/token/:path*"] };
