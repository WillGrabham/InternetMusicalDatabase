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

    console.log("Environment:", env.NODE_ENV);
    console.log("Full token:", JSON.stringify(token, null, 2));
    console.log("Role:", token?.role);
    console.log("Role type:", token?.role ? typeof token.role : "undefined");
    console.log("Role === ADMIN:", token?.role === "ADMIN");

    console.log(
      "Role toUpperCase === ADMIN:",
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      token?.role ? token.role.toString().toUpperCase() === "ADMIN" : false,
    );

    const isAdmin =
      token?.role === "ADMIN" ||
      (typeof token?.role === "string" &&
        token.role.toUpperCase() === "ADMIN") ||
      token?.role?.valueOf() === "ADMIN";

    console.log("Is admin:", isAdmin);

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
