import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isCreateRoute = path === "/musicals/create";
  const isEditRoute = /^\/musicals\/[^/]+\/edit/.test(path);

  if (isCreateRoute || isEditRoute) {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET,
      secureCookie: env.NODE_ENV === "production",
      raw: false, // Ensure we get the decoded token
    });

    const isAdmin =
      token?.role === "ADMIN" ||
      (typeof token?.role === "string" &&
        token.role.toUpperCase() === "ADMIN") ||
      token?.role?.valueOf() === "ADMIN";

    if (!isAdmin) {
      if (!token) {
        const url = new URL("/signin", request.url);
        url.searchParams.set("callbackUrl", encodeURI(request.url));
        return NextResponse.redirect(url);
      }

      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/musicals/create", "/musicals/:id/edit"],
};
