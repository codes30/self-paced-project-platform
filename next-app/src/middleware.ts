import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  const { pathname } = new URL(req.url);

  if (!token && pathname.startsWith("/challenges/")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!token && pathname === "/admin/challenge/create") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname === "/admin/challenge/create" && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
