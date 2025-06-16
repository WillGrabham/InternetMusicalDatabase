import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UserRoleEnum } from "~/types/schemas";
import { env } from "./env";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isCreateRoute = path === "/musicals/create";
  const isEditRoute = /^\/musicals\/[^/]+\/edit/.test(path);

  if (isCreateRoute || isEditRoute) {
    const token = await getToken({
      req: request,
      secret: env.AUTH_SECRET,
    });

    if (!token?.role || token.role !== UserRoleEnum.enum.ADMIN) {
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
