#!/usr/bin/env node
/**
 * After "next build" with output: "standalone", copy static and public into standalone folder
 * so you can upload the standalone folder to your VPS.
 * Run: npm run build && node scripts/copy-standalone.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const staticSrc = path.join(root, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");
const publicSrc = path.join(root, "public");
const publicDest = path.join(standaloneDir, "public");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn("Skip (missing):", src);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) {
      copyRecursive(s, d);
    } else {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
  console.log("Copied:", src, "->", dest);
}

if (!fs.existsSync(standaloneDir)) {
  console.error("Run 'npm run build' first. .next/standalone not found.");
  process.exit(1);
}

copyRecursive(staticSrc, staticDest);
copyRecursive(publicSrc, publicDest);
console.log("Done. Upload the contents of .next/standalone to your server.");
