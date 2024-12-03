import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse, type NextRequest } from "next/server";

// Define allowed roles for role-based access control
type AllowedRole = "user" | "admin" | "moderator";

// Helper to check if user has required role
const hasRequiredRole = (role: AllowedRole, userRoles?: string[]) => {
  return userRoles?.includes(role) ?? false;
};

export default withAuth(
  async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    
    // Get the current path
    const path = req.nextUrl.pathname;
    
    // Log request details in development
    if (process.env.NODE_ENV === "development") {
      console.log({
        method: req.method,
        path,
        token: token?.email
      });
    }

    // Handle unauthorized access
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Role-based access control for specific paths
    if (path.startsWith("/app/admin") && !hasRequiredRole("admin", token.roles as string[])) {
      return NextResponse.redirect(
        new URL("/auth/unauthorized", req.url)
      );
    }

    // Add custom headers
    const response = NextResponse.next();
    response.headers.set("x-auth-user", token.email as string);
    
    // You can also modify the response based on user properties
    if (token.isNewUser) {
      response.headers.set("x-show-onboarding", "true");
    }

    return response;
  },
  {
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
      newUser: "/auth/signup",
      signOut: "/auth/logout",
      verifyRequest: "/auth/verify-request",
    },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

// Configure protected routes
export const config = {
  matcher: [
    // Protect all routes under /app
    "/app/:path*",
    // Protect admin routes
    "/admin/:path*",
    // Exclude specific public paths
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};