// Prefixes site-relative paths with Astro's `base` so links work on GitHub Pages
// (served under /ai-program-site/) and, later, on the program's own domain (base '/').
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return base + (path.startsWith('/') ? path : `/${path}`);
}

export const BASE = base;
