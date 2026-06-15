import type { MenuCard } from "@/lib/menu-cards";

export function isBlobStorageUrl(url: string) {
  return url.includes("blob.vercel-storage.com");
}

/** Turn stored blob URL into a browser-loadable src (proxy for private blobs). */
export function getMenuImageSrc(storedUrl: string) {
  if (storedUrl.startsWith("/")) return storedUrl;
  if (isBlobStorageUrl(storedUrl)) {
    return `/api/blob?url=${encodeURIComponent(storedUrl)}`;
  }
  return storedUrl;
}

export function withDisplayImageUrl(card: MenuCard): MenuCard {
  return { ...card, image_url: getMenuImageSrc(card.image_url) };
}
