/** One year — menu blob URLs include a timestamp and change when replaced. */
export const MENU_IMAGE_MAX_AGE = 60 * 60 * 24 * 365;

export function menuImageCacheHeaders(etag?: string | null) {
  const cacheControl = `public, max-age=${MENU_IMAGE_MAX_AGE}, s-maxage=${MENU_IMAGE_MAX_AGE}, stale-while-revalidate=86400, immutable`;
  const cdnCacheControl = `public, max-age=${MENU_IMAGE_MAX_AGE}, stale-while-revalidate=86400`;

  const headers: Record<string, string> = {
    "Cache-Control": cacheControl,
    "CDN-Cache-Control": cdnCacheControl,
    "Vercel-CDN-Cache-Control": cdnCacheControl,
  };

  if (etag) {
    headers.ETag = etag;
  }

  return headers;
}

export function staticAssetCacheHeaders() {
  return menuImageCacheHeaders();
}
