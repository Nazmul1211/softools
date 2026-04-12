import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const RASTER_IMAGE_REGEX = /\.(png|jpe?g)$/i;
const EXCLUDED_IMAGE_PATHS = new Set([
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/softzar-og.png",
]);

function shouldRewriteToWebP(pathname: string, acceptHeader: string | null) {
  const normalizedPath = pathname.toLowerCase();

  if (!RASTER_IMAGE_REGEX.test(normalizedPath)) {
    return false;
  }

  if (EXCLUDED_IMAGE_PATHS.has(normalizedPath)) {
    return false;
  }

  return Boolean(acceptHeader?.includes("image/webp"));
}

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get("accept");

  if (!shouldRewriteToWebP(pathname, acceptHeader)) {
    return NextResponse.next();
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = pathname.replace(/\.(png|jpe?g)$/i, ".webp");

  return NextResponse.rewrite(rewrittenUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api).*)"],
};
