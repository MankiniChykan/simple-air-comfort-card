#!/usr/bin/env node
/**
 * GitHub Release Helper (ESM)
 * Usage: node github-release-helper.js 1.2.3
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fail = (msg, code = 1) => { console.error(`❌ ${msg}`); process.exit(code); };
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const read = (p) => fs.readFileSync(p);
const write = (p, s) => fs.writeFileSync(p, s);

const input = (process.argv[2] || '').trim();
if (!input) fail('You must specify a version. Example: node github-release-helper.js 1.0.1');
const version = input.replace(/^v/i, '');
const tag = `v${version}`;

const distDir = path.join(__dirname, 'dist');
const jsOut = path.join(distDir, 'simple-air-comfort-card.js');
const gzOut = `${jsOut}.gz`;
const checksumFile = path.join(distDir, 'checksums.txt');

try {
  try { run('gh --version'); } catch { fail('GitHub CLI (gh) is not installed or not on PATH.'); }
  const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  if (branch !== 'main') fail(`Please release from "main" (current: "${branch}").`);

  console.log(`📦 Updating package.json -> ${version}`);
  const pkgPath = path.join(__dirname, 'package.json');
  const pkg = JSON.parse(read(pkgPath));
  pkg.version = version;
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  console.log('🧹 Ensuring deps are installed (npm ci) …');
  run('npm ci');

  console.log('🔨 Building …');
  run('npm run build');

  if (!fs.existsSync(jsOut)) fail(`Build artifact missing: ${jsOut}`);
  if (!fs.existsSync(gzOut)) {
    console.log('🗜️  Creating gzip fallback …');
    write(gzOut, zlib.gzipSync(read(jsOut)));
  }

  console.log('🧮 Writing checksums …');
  const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
  const lines = [
    `${path.basename(jsOut)}  ${sha256(read(jsOut))}`,
    `${path.basename(gzOut)}  ${sha256(read(gzOut))}`,
  ].join('\n') + '\n';
  write(checksumFile, lines);

  console.log(`📁 Committing and tagging ${tag} …`);
  run(`git add package.json package-lock.json || true`);
  run(`git add -f "${jsOut}" "${gzOut}" "${checksumFile}"`);
  try {
    run(`git commit -m "chore(release): ${tag}"`);
  } catch {
    console.log('ℹ️  No changes to commit (already up to date). Proceeding …');
  }
  run(`git tag ${tag}`);

  console.log('🚀 Pushing branch and tag …');
  run('git push origin main');
  run(`git push origin ${tag}`);

  console.log('🏷  Creating GitHub release …');
  let notesFlag = `--notes "Auto release for ${tag}"`;
  try {
    const prev = execSync('git describe --tags --abbrev=0 --always --match "v*" 2>/dev/null || true')
      .toString().trim();
    if (prev && prev !== tag) {
      const notes = execSync(`git log --pretty=format:"- %s (%h)" ${prev}..HEAD`).toString().trim();
      if (notes) {
        const tmp = path.join(__dirname, '.release-notes.tmp.md');
        write(tmp, `## Changes\n\n${notes}\n`);
        notesFlag = `--notes-file "${tmp}"`;
      }
    }
  } catch { /* ignore */ }

  run(`gh release create ${tag} "${jsOut}" "${gzOut}" "${checksumFile}" --title "${tag}" ${notesFlag}`);
  console.log(`✅ Release ${tag} created successfully.`);
} catch (err) {
  fail(err.message || String(err));
}
