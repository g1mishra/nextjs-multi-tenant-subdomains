import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN;

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host");
  const subdomain = host?.split(".")[0];

  if (
    subdomain === "www" ||
    subdomain === BASE_DOMAIN ||
    url.pathname.endsWith("/not-found") ||
    url.pathname.endsWith("/plan-expired")
  ) {
    return NextResponse.next();
  }

  const clientData = isValidSlug(subdomain);

  if (!clientData.valid) {
    return NextResponse.redirect(new URL(`${url.protocol}//${BASE_DOMAIN}/not-found`, request.url));
  }

  if (!clientData.isSubscribed) {
    return NextResponse.redirect(
      new URL(`${url.protocol}//${BASE_DOMAIN}/plan-expired`, request.url)
    );
  }

  console.log("values", {
    url,
    host,
    subdomain,
    clientData,
  });

  return NextResponse.rewrite(
    new URL(`/clients/${subdomain}${url.pathname}${url.search}${url.hash}`, request.url)
  );
}

function isValidSlug(slug: string | undefined): {
  valid: boolean;
  isSubscribed: boolean;
} {
  if (!slug) return { valid: false, isSubscribed: false };

  const clients = ["client1", "client2", "client3"];

  return {
    valid: clients.includes(slug),
    isSubscribed: true,
  };
}

// Optionally, you can specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
