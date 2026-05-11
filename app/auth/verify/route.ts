import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { consumeMagicLink, createSession } from "@/app/lib/auth";
import { findOrCreateUser } from "@/app/lib/signin-actions";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/signin?error=missing-token", request.url)
    );
  }

  const email = await consumeMagicLink(token);
  if (!email) {
    return NextResponse.redirect(
      new URL("/signin?error=invalid-token", request.url)
    );
  }

  const user = await findOrCreateUser(email);
  await createSession(user.id, request.headers.get("user-agent") ?? undefined);

  // Brand-new users must complete onboarding (set handle + name) before
  // they can do anything else.
  if (!user.onboarded) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }
  return NextResponse.redirect(new URL("/", request.url));
}
