// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log(req.headers);
  },
  {
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      newUser: "/auth/signup",
    },
    callbacks: {
      authorized: ({ token }) => {
        console.log(token);
       return token? true:false
      
      },
    },
  }
);

export const config = { matcher: ["/app/:path*"] };
