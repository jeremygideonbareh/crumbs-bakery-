// swap-images.mjs
// Generates optimized, web-safe JPEG copies of the raw client photos in
// public/images/raw/ into public/images/. Width-only resize (no aspect crop)
// so the existing `object-cover` CSS in each slot keeps controlling the final
// crop — the website layout/look does not change, only the photo content.
//
// Filenames in raw/ carry the item name and price (e.g. "Brownies 60.jpeg",
// "Chicken pizza 80- (2).jpeg"). (N) = alternate angle of the same item.
// We emit kebab-case web-safe names. Hero/wide candidates also get a -1600.
//
// Usage:
//   node scripts/swap-images.mjs            # live (skips existing unless --force)
//   node scripts/swap-images.mjs --force    # overwrite existing outputs
//   node scripts/swap-images.mjs --dry-run  # preview only
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const RAW_DIR = 'public/images/raw';
const OUT_DIR = 'public/images';

// raw_filename: file in public/images/raw/
// target_local_filename: output base name (kebab-case, .jpeg)
// target_width_px: comma-sep widths; first = base name, rest = -<w> suffix
//   '800'          -> <base>.jpeg            (800px wide)
//   '800,1600'     -> <base>.jpeg + <base>-1600.jpeg  (hero/wide candidates)
const IMAGE_MAP = [
  // ── Brownies / muffins / cupcakes (per-piece) ─────────────────────────────
  { raw_filename: 'Brownies 60.jpeg', target_local_filename: 'brownies.jpeg', target_width_px: '800' },
  { raw_filename: 'Brownies 60 (2).jpeg', target_local_filename: 'brownies-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Banana and chocolate muffin 60-.jpeg', target_local_filename: 'banana-choc-muffin.jpeg', target_width_px: '800' },
  { raw_filename: 'Banana and chocolate muffin 60- (2).jpeg', target_local_filename: 'banana-choc-muffin-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Banana and chocolate muffin 60- (3).jpeg', target_local_filename: 'banana-choc-muffin-3.jpeg', target_width_px: '800' },
  { raw_filename: 'Lemon and blueberry muffins.jpeg', target_local_filename: 'lemon-blueberry-muffin.jpeg', target_width_px: '800' },
  { raw_filename: 'Lemon curd cupcake 50-.jpeg', target_local_filename: 'lemon-curd-cupcake.jpeg', target_width_px: '800' },

  // ── Cheesecakes ───────────────────────────────────────────────────────────
  { raw_filename: 'Japanese cheesecake.jpeg', target_local_filename: 'japanese-cheesecake.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'Japanese cheesecake 180-.jpeg', target_local_filename: 'japanese-cheesecake-slice.jpeg', target_width_px: '800' },
  { raw_filename: 'Japanese cheesecake (2).jpeg', target_local_filename: 'japanese-cheesecake-slice-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Japanese cheesecake (3).jpeg', target_local_filename: 'japanese-cheesecake-slice-3.jpeg', target_width_px: '800' },
  { raw_filename: 'NY cheesecake.jpeg', target_local_filename: 'ny-cheesecake.jpeg', target_width_px: '800' },
  { raw_filename: 'NY cheesecake 150-.jpeg', target_local_filename: 'ny-cheesecake-slice.jpeg', target_width_px: '800' },
  { raw_filename: 'Burnt basque cheesecake 180-.jpeg', target_local_filename: 'burnt-basque-cheesecake.jpeg', target_width_px: '800,1600' },

  // ── Cakes / slices ─────────────────────────────────────────────────────────
  { raw_filename: 'Red velvet.jpeg', target_local_filename: 'red-velvet-cake.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'Red velvet (2).jpeg', target_local_filename: 'red-velvet-cake-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Carrot cake slices 50-.jpeg', target_local_filename: 'carrot-cake-slice.jpeg', target_width_px: '800' },
  { raw_filename: 'Hummingbird slices 50-.jpeg', target_local_filename: 'hummingbird-slice.jpeg', target_width_px: '800' },
  { raw_filename: 'Chocolate and whipped caramel 200-.jpeg', target_local_filename: 'chocolate-whipped-caramel.jpeg', target_width_px: '800,1600' },

  // ── Choux / savory ─────────────────────────────────────────────────────────
  { raw_filename: 'Cream puffs.jpeg', target_local_filename: 'cream-puffs.jpeg', target_width_px: '800' },
  { raw_filename: 'Eclairs 50-.jpeg', target_local_filename: 'eclair.jpeg', target_width_px: '800' },
  { raw_filename: 'Quiche 50-.jpeg', target_local_filename: 'quiche.jpeg', target_width_px: '800' },
  { raw_filename: 'Quiche 50- (2).jpeg', target_local_filename: 'quiche-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Quiche.jpeg', target_local_filename: 'quiche-3.jpeg', target_width_px: '800' },
  { raw_filename: 'Chicken pizza 80-.jpeg', target_local_filename: 'chicken-pizza.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'Chicken pizza 80- (2).jpeg', target_local_filename: 'chicken-pizza-2.jpeg', target_width_px: '800' },
  { raw_filename: 'Chicken pizza 80- (3).jpeg', target_local_filename: 'chicken-pizza-3.jpeg', target_width_px: '800' },
  { raw_filename: 'Chicken pizza 80- (4).jpeg', target_local_filename: 'chicken-pizza-4.jpeg', target_width_px: '800' },
  { raw_filename: 'Chicken pot pies 50-.jpeg', target_local_filename: 'chicken-pot-pies.jpeg', target_width_px: '800' },

  // ── Menu flatlays (category headers / heroes) ─────────────────────────────
  { raw_filename: 'cakes menu.jpeg', target_local_filename: 'cakes-menu.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'cheese cakes menu.jpeg', target_local_filename: 'cheesecake-menu.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'fruit cakes menu.jpeg', target_local_filename: 'fruit-cake-menu.jpeg', target_width_px: '800,1600' },

  // ── Unnamed "fresh bakes" decorative shots (variations throughout the site) ─
  { raw_filename: 'WhatsApp Image 2026-07-15 at 3.21.53 PM (1).jpeg', target_local_filename: 'fresh-bakes-1.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.55 PM (1).jpeg', target_local_filename: 'fresh-bakes-2.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.05 PM.jpeg', target_local_filename: 'fresh-bakes-3.jpeg', target_width_px: '800,1600' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.09 PM.jpeg', target_local_filename: 'fresh-bakes-4.jpeg', target_width_px: '800,1600' },
];

// ── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');

function buildVariants(baseName, widths) {
  // widths[0] -> base name; widths[i>0] -> <base>-<w>.jpeg
  const results = [];
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    results.push(
      i === 0
        ? { filename: baseName, width: w }
        : { filename: `${baseName.replace(/\.jpeg$/, '')}-${w}.jpeg`, width: w },
    );
  }
  return results;
}

async function processEntry(entry) {
  const rawPath = path.join(RAW_DIR, entry.raw_filename);
  if (!fs.existsSync(rawPath)) {
    return `FAIL: ${entry.raw_filename} — raw file not found at ${rawPath}`;
  }

  const widths = String(entry.target_width_px)
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
  if (widths.length === 0) {
    return `FAIL: ${entry.raw_filename} — no valid widths in "${entry.target_width_px}"`;
  }

  const variants = buildVariants(entry.target_local_filename, widths);
  const lines = [];

  for (const v of variants) {
    const outPath = path.join(OUT_DIR, v.filename);

    if (fs.existsSync(outPath) && !FORCE) {
      lines.push(`SKIP: ${v.filename} exists (use --force to overwrite)`);
      continue;
    }
    if (DRY_RUN) {
      lines.push(`WOULD: ${entry.raw_filename} -> ${v.filename} (w=${v.width}, free-height)`);
      continue;
    }

    try {
      await sharp(rawPath)
        .resize({ width: v.width, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(outPath);
      const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
      lines.push(`OK: ${entry.raw_filename} -> ${v.filename} (w=${v.width}, ${kb}kb)`);
    } catch (err) {
      lines.push(`FAIL: ${entry.raw_filename} -> ${v.filename} — ${err.message}`);
    }
  }
  return lines.join('\n');
}

async function main() {
  if (IMAGE_MAP.length === 0) {
    console.log('IMAGE_MAP is empty. Populate it before running.');
    process.exit(0);
  }
  console.log(`swap-images.mjs — ${DRY_RUN ? 'DRY RUN (no files written)' : 'LIVE'}\n`);

  const results = [];
  for (const entry of IMAGE_MAP) {
    const r = await processEntry(entry);
    results.push(r);
    console.log(r);
  }

  const flat = results.join('\n').split('\n');
  const ok = flat.filter((l) => l.startsWith('OK:')).length;
  const skip = flat.filter((l) => l.startsWith('SKIP:')).length;
  const fail = flat.filter((l) => l.startsWith('FAIL:')).length;
  console.log(`\n--- Summary ---`);
  console.log(`OK:    ${ok}`);
  console.log(`SKIP:  ${skip}`);
  console.log(`FAIL:  ${fail}`);
  console.log(`Total: ${IMAGE_MAP.length} entries, ${ok + skip + fail} variants`);

  if (fail > 0 && !DRY_RUN) process.exit(1);
}

main().catch((err) => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
