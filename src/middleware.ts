import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token");

  // Proteger rotas profissionais
  if (pathname.startsWith("/professional")) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirecionar se já estiver autenticado e tentar acessar login
  if (pathname === "/login" && authToken) {
    return NextResponse.redirect(new URL("/professional", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/professional/:path*", "/login"],
};

