/*
 * Bundles the Vite output in dist/ into ONE self-contained index.html so it can be
 * uploaded as-is (no /assets folder needed): JS, CSS and every image become inline
 * code or base64 data URIs.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, resolve } from 'node:path';

const PROJECT_ROOT = resolve(import.meta.dirname, '..');
const DIST = join(PROJECT_ROOT, 'dist');

const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(DIST);
const dataUris = new Map();
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!MIME[ext]) continue;
  const webPath = '/' + file.slice(DIST.length + 1).replaceAll('\\', '/');
  dataUris.set(
    webPath,
    `data:${MIME[ext]};base64,${readFileSync(file).toString('base64')}`,
  );
}

// Longest path first so '/assets/logo.png' never clobbers '/assets/logo.png2'.
const paths = [...dataUris.keys()].sort((a, b) => b.length - a.length);

function inlineAssets(code) {
  let text = code;
  let hits = 0;
  for (const p of paths) {
    if (text.includes(p)) {
      text = text.split(p).join(dataUris.get(p));
      hits += 1;
    }
  }
  return { text, hits };
}

let html = readFileSync(join(DIST, 'index.html'), 'utf8');

html = html.replace(
  /<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/g,
  (tag) => {
    const href = tag.match(/href=["']([^"']+)["']/)?.[1];
    // Leave remote CDN stylesheets (Google Fonts) as a normal link tag.
    if (!href || /^(https?:)?\/\//.test(href)) return tag;
    const css = readFileSync(join(DIST, href.replace(/^\//, '')), 'utf8');
    return `<style>${inlineAssets(css).text}</style>`;
  },
);

html = html.replace(/<link\b[^>]*rel=["']?modulepreload["']?[^>]*>/g, '');

html = html.replace(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/g, (tag, src) => {
  if (/^(https?:)?\/\//.test(src)) return tag;
  const file = join(DIST, src.replace(/^\//, ''));
  const js = readFileSync(file, 'utf8').replaceAll('</script', '<\\/script');
  return `<script type="module">${inlineAssets(js).text}</script>`;
});

html = inlineAssets(html).text;

writeFileSync(join(DIST, 'index.html'), html);
writeFileSync(join(PROJECT_ROOT, 'index.html'), html);

const mb = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
const leftovers = paths.filter((p) => html.includes(p));
console.log(`Single-file build: ${basename(PROJECT_ROOT)} -> index.html (${mb} MB)`);
console.log(`Inlined ${dataUris.size} asset files.`);
if (leftovers.length) console.warn('Still has file paths left over:', leftovers);
