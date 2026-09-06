// Copies the MediaPipe Tasks Vision WASM runtime from node_modules into public/mediapipe/wasm so the
// site serves it itself (no third-party script host at runtime). Runs before `astro dev` and `astro build`
// (see package.json); the copy is gitignored. The models themselves are fetched from Google's model
// bucket on demand (see src/components/HandsFree.astro).
import { cpSync, mkdirSync, existsSync } from 'node:fs';
const src = new URL('../node_modules/@mediapipe/tasks-vision/wasm/', import.meta.url);
const dst = new URL('../public/mediapipe/wasm/', import.meta.url);
if (!existsSync(src)) { console.error('copy-mediapipe: @mediapipe/tasks-vision is not installed; run npm install'); process.exit(1); }
mkdirSync(dst, { recursive: true });
cpSync(src, dst, { recursive: true });
console.log('copy-mediapipe: runtime copied to public/mediapipe/wasm');
