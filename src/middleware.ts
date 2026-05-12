export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/tech/:path*", "/api/progress/:path*"],
};
