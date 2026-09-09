/** Public URL helpers for organised site assets under `/public/assets`. */

export function councilImagePath(filename: string): string {
  return `/assets/council/${filename}`;
}

export function mapImagePath(mapId: string, extension: 'jpg' | 'png' | 'webp' = 'jpg'): string {
  return `/assets/maps/${mapId}.${extension}`;
}

export function communityImagePath(
  category: 'events' | 'guides' | 'builds' | 'media',
  filename: string,
): string {
  return `/assets/community/${category}/${filename}`;
}

export function shopImagePath(filename: string): string {
  return `/assets/shop/${filename}`;
}

export function galleryImagePath(filename: string): string {
  return `/assets/gallery/${filename}`;
}

export function backgroundImagePath(filename: string): string {
  return `/assets/backgrounds/${filename}`;
}

export function brandingImagePath(filename: string): string {
  return `/assets/branding/${filename}`;
}

export function effectsImagePath(filename: string): string {
  return `/assets/effects/${filename}`;
}

/** Primary logo — kept at assets root for favicon/header convenience. */
export const LOGO_PATH = '/assets/logo.png';
