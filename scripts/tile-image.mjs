// Make the small background image the previous/next course tiles use (course page footer):
//   node scripts/tile-image.mjs <still.jpg|png> <slug>       e.g. node scripts/tile-image.mjs ~/Downloads/ai45-still.png ai-45
// Writes public/tiles/<slug>.jpg, 900px wide, 16:9 centre crop, ~50 KB. Use the still the hero video was made from;
// with no still, scripts/hero-video.mjs already writes one from the video's poster frame.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
const [src, slug] = process.argv.slice(2);
if (!src || !slug) { console.error('usage: node scripts/tile-image.mjs <still> <slug>'); process.exit(1); }
mkdirSync('public/tiles', { recursive: true });
const out = `public/tiles/${slug}.jpg`;
await sharp(src).resize({ width: 900, height: 506, fit: 'cover', position: 'centre' }).jpeg({ quality: 78, mozjpeg: true }).toFile(out);
console.log(`tile-image: wrote ${out}`);
