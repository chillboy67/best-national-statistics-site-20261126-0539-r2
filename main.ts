// Canada by Numbers — the program that hands the site in (Node 22, standard
// library only). The site itself is plain static files under app/: an
// index.html a browser opens, with its data and scripts beside it and no build
// step. This program copies app/ and screenshots/ from beside this file to the
// grading directory (/output, or MAKEFUN_OUTPUT_DIR outside the grader) and
// writes /output/dossier.json with the vendored make.fun library — the summary
// the judge reads: the screenshots, the first load's files and bytes, and the
// source. Leave vendor/makefun-frontend.ts as it is: the scorer rebuilds the
// dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const appDir = join(here, "app");
const shotsDir = join(here, "screenshots");

// Refuse to hand in a broken entry rather than ship an empty /output.
if (!existsSync(join(appDir, "index.html"))) {
  throw new Error("app/index.html is missing — the site cannot be handed in");
}
if (!existsSync(shotsDir) || readdirSync(shotsDir).filter((f) => /\.(png|jpe?g)$/i.test(f)).length < 3) {
  throw new Error("screenshots/ needs at least 3 PNG/JPEG renders of the site");
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
cpSync(shotsDir, join(out, "screenshots"), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

function dirBytes(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    total += entry.isDirectory() ? dirBytes(p) : statSync(p).size;
  }
  return total;
}

const shotFiles = readdirSync(shotsDir).filter((f) => /\.(png|jpe?g)$/i.test(f));
console.log(
  `Canada by Numbers handed in: app/ (${dirBytes(appDir)} bytes) + ` +
    `${shotFiles.length} screenshots + dossier.json -> ${out}`,
);
