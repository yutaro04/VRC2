import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // トークンを取得してログイン状態を確認
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET
  });

  const isLoggedIn = !!token;

  // /user パスが含まれるページは認証が必要
  const isProtectedRoute = pathname.startsWith("/user");

  // 保護されたルートに未認証でアクセスした場合はログイン画面へリダイレクト
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ログイン済みユーザーがログイン画面にアクセスした場合はホームへリダイレクト
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
