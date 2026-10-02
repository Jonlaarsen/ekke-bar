import { menuImageCacheHeaders } from "@/lib/image-cache";
import { isBlobStorageUrl } from "@/lib/menu-image-url";
import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url || !isBlobStorageUrl(url)) {
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
  }

  const ifNoneMatch = request.headers.get("if-none-match") ?? undefined;

  try {
    const result = await get(url, {
      access: "private",
      ifNoneMatch,
    });

    if (!result) {
      return new NextResponse(null, { status: 404 });
    }

    const cacheHeaders = menuImageCacheHeaders(result.blob.etag);

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: cacheHeaders,
      });
    }

    return new NextResponse(result.stream, {
      headers: {
        ...cacheHeaders,
        "Content-Type": result.blob.contentType,
        "Content-Length": String(result.blob.size),
      },
    });
  } catch (error) {
    console.error("Blob proxy error:", error);
    return new NextResponse(null, { status: 500 });
  }
}
