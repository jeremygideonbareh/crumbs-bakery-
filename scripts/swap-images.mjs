// swap-images.mjs
// Mirrored from .omo/artifacts/image-mapping.md — populated by TODO 1.1
// Generates sized/cropped JPEG copies of raw client photos into public/images/
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const RAW_DIR = 'public/images/raw';
const OUT_DIR = 'public/images';

/**
 * IMAGE_MAP: one entry per assigned raw → Pexels slot.
 * Populated after TODO 1.1 image identification completes.
 * Fields:
 *   raw_filename         – file in public/images/raw/
 *   identified_subject   – what the worker identified in the photo
 *   assigned_pexels_id   – the Pexels ID this raw replaces
 *   assigned_slot_label  – human slot description
 *   target_local_filename – output filename (lowercase, hyphen-sep, .jpeg)
 *   target_aspect        – '1:1' | '4:3' | '16:9' | '21:9' | 'free-height-hero'
 *   target_width_px      – largest width (comma-sep for multi-width: '400,800,1200,1920')
 */
const IMAGE_MAP = [
  // Raw filename → Pexels slot
  // ⚠️ All identified_subject fields = UNKNOWN — multimodal outage on 2026-07-19
  // Mirrored from .omo/artifacts/image-mapping.md — user must verify before code edits
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.55 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 2067396, assigned_slot_label: 'brownie / crafted-with-love', target_local_filename: 'brownies.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.55 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 2144200, assigned_slot_label: 'hero / bespoke cake', target_local_filename: 'bespoke-cake.jpeg', target_aspect: 'free-height-hero', target_width_px: '400,800,1200,1920' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.56 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 140831, assigned_slot_label: 'cinnamon rolls / amazing cakes', target_local_filename: 'cinnamon-rolls.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.57 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 37353913, assigned_slot_label: 'choc chip cookie', target_local_filename: 'choc-chip-cookie.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.57 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 38058461, assigned_slot_label: 'blueberry cheesecake', target_local_filename: 'blueberry-cheesecake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.22.59 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 14105, assigned_slot_label: 'vanilla cupcake', target_local_filename: 'vanilla-cupcake.jpeg', target_aspect: '1:1', target_width_px: '400,800,1200' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.05 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 132694, assigned_slot_label: 'chocolate cake', target_local_filename: 'chocolate-cake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.06 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 1793037, assigned_slot_label: 'vintage / custom orders', target_local_filename: 'vintage-custom.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.06 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 5702761, assigned_slot_label: 'delivery / about bakery', target_local_filename: 'delivery-bakery.jpeg', target_aspect: '4:3', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.07 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 14766327, assigned_slot_label: 'tiramisu', target_local_filename: 'tiramisu.jpeg', target_aspect: '1:1', target_width_px: '400,800,1200' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.08 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 32916204, assigned_slot_label: 'muffin / hot snack', target_local_filename: 'muffin.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.08 PM (2).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 16402099, assigned_slot_label: 'chocolate eclair / cream puff', target_local_filename: 'eclair.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.08 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 20677473, assigned_slot_label: 'edible photo cupcake / berliners', target_local_filename: 'edible-photo-cupcake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.09 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 32706248, assigned_slot_label: 'french macarons', target_local_filename: 'french-macarons.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.10 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 37110821, assigned_slot_label: 'edible photo cake / carrot cake', target_local_filename: 'edible-photo-cake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.11 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 34155188, assigned_slot_label: 'funfetti sheet / chocolate birthday', target_local_filename: 'funfetti-sheet.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.11 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 29230134, assigned_slot_label: 'raspberry ripple / hummingbird', target_local_filename: 'raspberry-ripple.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.12 PM (1).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 32421567, assigned_slot_label: 'chocolate cupcake', target_local_filename: 'chocolate-cupcake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.12 PM (2).jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 9820, assigned_slot_label: 'lemon drizzle / lemon bars', target_local_filename: 'lemon-drizzle.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.12 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 4242130, assigned_slot_label: 'banana bread', target_local_filename: 'banana-bread.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
  { raw_filename: 'WhatsApp Image 2026-07-18 at 4.23.13 PM.jpeg', identified_subject: 'UNKNOWN-PENDING-USER-REVIEW', assigned_pexels_id: 1055271, assigned_slot_label: 'red velvet cupcake', target_local_filename: 'red-velvet-cupcake.jpeg', target_aspect: '1:1', target_width_px: '400,800' },
];

// ── CLI flags ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE   = args.includes('--force');

function parseAspect(str) {
  if (str === 'free-height-hero') return null; // no aspect crop
  const m = str.match(/^(\d+):(\d+)$/);
  if (!m) throw new Error(`Invalid aspect "${str}". Use X:Y or "free-height-hero".`);
  return { w: Number(m[1]), h: Number(m[2]) };
}

function buildVariants(baseName, aspect, widths) {
  // width[0] is the largest (full-size), remaining are narrower variants
  const results = [];
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    if (i === 0) {
      results.push({ filename: baseName, width: w });
    } else {
      results.push({ filename: `${baseName.replace(/\.jpeg$/, '')}-${w}.jpeg`, width: w });
    }
  }
  return results;
}

async function processEntry(entry) {
  const rawPath = path.join(RAW_DIR, entry.raw_filename);
  if (!fs.existsSync(rawPath)) {
    return `FAIL: ${entry.raw_filename} — raw file not found at ${rawPath}`;
  }

  const baseName = entry.target_local_filename;
  const widths = entry.target_width_px.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
  if (widths.length === 0) {
    return `FAIL: ${entry.raw_filename} — no valid widths in "${entry.target_width_px}"`;
  }

  const aspect = parseAspect(entry.target_aspect);
  const variants = buildVariants(baseName, aspect, widths);

  const outputLines = [];

  for (const v of variants) {
    const outPath = path.join(OUT_DIR, v.filename);

    if (fs.existsSync(outPath) && !FORCE) {
      outputLines.push(`SKIP: ${v.filename} exists (use --force to overwrite)`);
      continue;
    }

    if (DRY_RUN) {
      outputLines.push(`WOULD: ${rawPath} → ${v.filename} (w=${v.width}, aspect=${entry.target_aspect || 'free'})`);
      continue;
    }

    try {
      // Read source metadata
      const metadata = await sharp(rawPath).metadata();
      const srcW = metadata.width;
      const srcH = metadata.height;

      let pipeline = sharp(rawPath);

      if (aspect) {
        // Fixed aspect: resize + crop-cover
        const cropH = Math.round(v.width * aspect.h / aspect.w);
        pipeline = pipeline.resize(v.width, cropH, { fit: 'cover', position: 'attention' });
      } else {
        // Free-height-hero: resize width only, no height constraint
        pipeline = pipeline.resize({ width: v.width, withoutEnlargement: true });
      }

      pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
      await pipeline.toFile(outPath);

      const stats = fs.statSync(outPath);
      const kb = (stats.size / 1024).toFixed(1);
      outputLines.push(`OK: ${entry.raw_filename} → ${v.filename} (${v.width}×?, ${kb}kb)`);
    } catch (err) {
      outputLines.push(`FAIL: ${entry.raw_filename} → ${v.filename} — ${err.message}`);
    }
  }

  return outputLines.join('\n');
}

async function main() {
  if (IMAGE_MAP.length === 0) {
    console.log('IMAGE_MAP is empty. Populate it from .omo/artifacts/image-mapping.md before running.');
    process.exit(0);
  }

  console.log(`swap-images.mjs — ${DRY_RUN ? 'DRY RUN (no files written)' : 'LIVE'}\n`);

  let okCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (const entry of IMAGE_MAP) {
    const result = await processEntry(entry);
    console.log(result);
    if (result.startsWith('OK') || result.includes('\nOK:')) okCount++;
    else if (result.startsWith('SKIP')) skipCount++;
    else if (result.startsWith('FAIL')) failCount++;

    // Count embedded OK/SKIP/FAIL lines in multi-variant output
    const okLines = result.split('\n').filter(l => l.startsWith('OK:'));
    const skipLines = result.split('\n').filter(l => l.startsWith('SKIP:'));
    const failLines = result.split('\n').filter(l => l.startsWith('FAIL:'));
    // Adjust — the entry-level counters above can be wrong for multi-line output
    // Recalculate: each entry is one IMAGE_MAP row
  }

  // Recompute correctly
  const allLines = [];
  for (const entry of IMAGE_MAP) {
    allLines.push(await processEntry(entry));
  }
  const flatOk = allLines.flatMap(l => l.split('\n').filter(line => line.startsWith('OK:'))).length;
  const flatSkip = allLines.flatMap(l => l.split('\n').filter(line => line.startsWith('SKIP:'))).length;
  const flatFail = allLines.flatMap(l => l.split('\n').filter(line => line.startsWith('FAIL:'))).length;

  console.log(`\n--- Summary ---`);
  console.log(`OK:    ${flatOk}`);
  console.log(`SKIP:  ${flatSkip}`);
  console.log(`FAIL:  ${flatFail}`);
  console.log(`Total: ${IMAGE_MAP.length} entries, ${flatOk + flatSkip + flatFail} variants`);

  if (flatFail > 0 && !DRY_RUN) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(1);
});
