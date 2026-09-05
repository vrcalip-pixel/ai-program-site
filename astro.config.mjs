// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Deployed to GitHub Pages as a project site for now. When the program domain is
// registered, set `site` to that domain and `base` to '/' (see TODO.md).
export default defineConfig({
  site: 'https://vrcalip-pixel.github.io',
  base: '/ai-program-site',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
