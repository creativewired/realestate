import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_SECRET;
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isAuthed = token && secret && token === secret;

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!isAuthed && !isLoginPage) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (isAuthed && isLoginPage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};