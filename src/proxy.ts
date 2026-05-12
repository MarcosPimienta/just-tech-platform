import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    return null; // Continue to the requested page
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - login (custom login page)
     * - register (custom register page)
     * - favicon.ico, logo.png (public assets)
     */
    "/((?!api/auth|api/register|_next/static|_next/image|login|register|favicon.ico|logo.png).*)",
  ],
};
