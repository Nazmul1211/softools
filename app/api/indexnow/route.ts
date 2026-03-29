import { NextRequest, NextResponse } from "next/server";

// IndexNow API key - In production, store this in environment variables
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "softzar-indexnow-key-2024";
const SITE_HOST = "softzar.com";

/**
 * IndexNow API endpoint for instant search engine indexing
 * Supports Bing, Yandex, Seznam, and Naver
 * 
 * Usage:
 * POST /api/indexnow
 * Body: { "urls": ["/new-tool", "/updated-page"] }
 * 
 * Or for single URL:
 * GET /api/indexnow?url=/new-tool
 */

const SEARCH_ENGINES = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; results: Record<string, string> }> {
  const fullUrls = urls.map((url) => 
    url.startsWith("http") ? url : `https://${SITE_HOST}${url.startsWith("/") ? url : "/" + url}`
  );

  const results: Record<string, string> = {};

  // Submit to all IndexNow endpoints
  for (const engine of SEARCH_ENGINES) {
    try {
      const response = await fetch(engine, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: SITE_HOST,
          key: INDEXNOW_KEY,
          keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
          urlList: fullUrls,
        }),
      });

      if (response.ok || response.status === 200 || response.status === 202) {
        results[engine] = "success";
      } else {
        results[engine] = `failed: ${response.status}`;
      }
    } catch (error) {
      results[engine] = `error: ${error instanceof Error ? error.message : "unknown"}`;
    }
  }

  const hasSuccess = Object.values(results).some((r) => r === "success");
  return { success: hasSuccess, results };
}

// GET handler for single URL submission
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  const result = await submitToIndexNow([url]);
  return NextResponse.json(result);
}

// POST handler for bulk URL submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls || body.urlList || [];

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'urls' array in request body" },
        { status: 400 }
      );
    }

    if (urls.length > 10000) {
      return NextResponse.json(
        { error: "Maximum 10,000 URLs allowed per request" },
        { status: 400 }
      );
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json({
      ...result,
      submitted: urls.length,
      message: result.success 
        ? `Successfully submitted ${urls.length} URL(s) to search engines`
        : "Failed to submit to any search engine",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body", details: error instanceof Error ? error.message : "unknown" },
      { status: 400 }
    );
  }
}
