import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { useAuthStatus } from "@/hooks/useAuthStatus";

export const config = {
  matcher: ["/", "/login", "/mypage/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // cookieがある場合はログイン状態とみなす
  // ログイン状態でなければ、ログイン画面へ遷移させる
  if (request.cookies.size) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/mypage/home", request.url));
    }
    return;
  } else if (pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
