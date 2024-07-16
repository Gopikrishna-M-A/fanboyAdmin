import { NextResponse } from 'next/server';

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  console.log("path",path);
  const session = !!req.cookies.get("next-auth.session-token")
  console.log("session",session);
  if (!session) {
    return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${path}`, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/','/inventory','/sales',
  ]
}
