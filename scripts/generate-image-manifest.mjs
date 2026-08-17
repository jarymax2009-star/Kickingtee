import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "products");
const outFile = path.join(process.cwd(), "src", "lib", "image-manifest.json");
const KNOWN_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

const manifest = {};

if (fs.existsSync(dir)) {
  for (const file of fs.readdirSync(dir)) {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (!KNOWN_EXTENSIONS.has(ext)) continue;
    const slug = path.basename(file, path.extname(file));
    manifest[slug] = ext;
  }
}

fs.writeFileSync(outFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `[image-manifest] wrote ${Object.keys(manifest).length} entr${
    Object.keys(manifest).length === 1 ? "y" : "ies"
  } to ${path.relative(process.cwd(), outFile)}`
);
