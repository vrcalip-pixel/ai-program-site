// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Served at the program's own domain (custom domain set in the repo's Pages settings;
// DNS at Namecheap). The old github.io/ai-program-site address redirects here.
// Stable (un-hashed) names for browser scripts only; Astro's server-side build keeps its defaults.
function stableClientNames() {
  return {
    name: 'stable-client-names',
    config(cfg) {
      if (cfg.build?.ssr) return;
      return { build: { rollupOptions: { output: { entryFileNames: '_astro/[name].js', chunkFileNames: '_astro/[name].js', assetFileNames: '_astro/[name][extname]' } } } };
    },
  };
}

export default defineConfig({
  site: 'https://aifordigitaltransformation.org',
  base: '/',
  trailingSlash: 'ignore',
  // Pages are cached for ten minutes by GitHub Pages. Inlining the CSS and using stable script names
  // means a cached page never points at an asset a later deploy has removed.
  build: { format: 'directory', inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss(), stableClientNames()] },
});
