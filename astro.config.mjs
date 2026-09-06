// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Served at the program's own domain (custom domain set in the repo's Pages settings;
// DNS at Namecheap). The old github.io/ai-program-site address redirects here.
export default defineConfig({
  site: 'https://aifordigitaltransformation.org',
  base: '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
