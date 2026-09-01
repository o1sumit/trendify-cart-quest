const CATALOG_IMAGES: Record<string, string[]> = {
  "wireless-bluetooth-headphones": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  ],
  "smart-fitness-watch": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  ],
  "portable-laptop-stand": [
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80",
  ],
  "wireless-charging-pad": [
    "https://images.unsplash.com/photo-1591290619762-c588f7cb0f07?auto=format&fit=crop&w=1200&q=80",
  ],
  "gaming-mechanical-keyboard": [
    "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
  ],
  "ultra-hd-webcam": [
    "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=1200&q=80",
  ],
};

const GENERIC_PLACEHOLDER = "/placeholder.svg";

export function resolveProductImages(
  slug: string,
  images: string[] | null | undefined
): string[] {
  const curated = CATALOG_IMAGES[slug];
  if (curated) return curated;

  const usable = (images ?? []).filter(
    (src) => src && src !== GENERIC_PLACEHOLDER
  );
  return usable.length > 0 ? usable : [GENERIC_PLACEHOLDER];
}
