// Encode a course hero clip the way the site expects (see BRIEF §9 and TODO item 11):
//   node scripts/hero-video.mjs <source.mp4> <slug>        e.g. node scripts/hero-video.mjs ~/Downloads/ai45.mp4 ai-45
// Produces public/video/<slug>.mp4 (H.264), <slug>.webm (VP9) and <slug>.jpg (poster), each at the source's own size
// (no upscaling), silent, with the last LOOP seconds crossfaded into the first so the loop restarts without a jump.
// Then set `video: true` in src/content/courses/<slug>.md. Needs ffmpeg: on PATH, or set FFMPEG=/path/to/ffmpeg.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';

const [src, slug] = process.argv.slice(2);
if (!src || !slug || !existsSync(src)) { console.error('usage: node scripts/hero-video.mjs <source.mp4> <slug>'); process.exit(1); }
const ff = process.env.FFMPEG || 'ffmpeg';
const LOOP = 0.8;                                                            // seconds of crossfade at the loop point
// `ffmpeg -i` with no output exits non-zero by design; the stream info we want is on stderr either way
let probe = '';
try { execFileSync(ff, ['-hide_banner', '-i', src], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { probe = String(e.stderr || ''); }
const dur = (() => { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(probe); return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : NaN; })();
const fps = (() => { const m = /([\d.]+) fps/.exec(probe); return m ? +m[1] : 24; })();
if (!(dur > LOOP * 2)) { console.error('clip too short or unreadable'); process.exit(1); }
// body = clip from LOOP to the end; tail = the first LOOP seconds, faded in over the body's last LOOP seconds
const filter = `[0:v]trim=${LOOP}:${dur},setpts=PTS-STARTPTS,fps=${fps},settb=AVTB[a];[0:v]trim=0:${LOOP},setpts=PTS-STARTPTS,fps=${fps},settb=AVTB[b];[a][b]xfade=transition=fade:duration=${LOOP}:offset=${(dur - 2 * LOOP).toFixed(3)}[v]`;
mkdirSync('public/video', { recursive: true });
const run = (args) => execFileSync(ff, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
run(['-i', src, '-filter_complex', filter, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `public/video/${slug}.mp4`]);
run(['-i', src, '-filter_complex', filter, '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-crf', '33', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `public/video/${slug}.webm`]);
run(['-ss', '0.5', '-i', src, '-frames:v', '1', '-q:v', '3', `public/video/${slug}.jpg`]);
console.log(`hero-video: wrote public/video/${slug}.{mp4,webm,jpg} (${(dur - LOOP).toFixed(2)} s loop). Now set video: true in src/content/courses/${slug}.md`);
