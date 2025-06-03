import type { auth } from "@/lib/auth/auth";
import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  // Проверяем сессию пользователя через API
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "", // Прокидываем куки для авторизации
      },
    }
  );

  // Если пользователь не осуществил вход(нет сессии) - редирект на логин
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// закрытие роуты (проверить все роуты после создания)
export const config = {
  matcher: ["/dashboard/:path*", "/email-verified"],
};
