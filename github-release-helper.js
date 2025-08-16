#!/usr/bin/env node
/**
 * GitHub Release Helper
 * Usage: node github-release-helper.js 1.2.3
 *
 * - Bumps package.json version
 * - npm ci && npm run build (produces dist/*.js and dist/*.js.gz)
 * - Commits version + dist artifacts (force-add even if ignored)
 * - Tags vX.Y.Z and pushes
 * - Creates a GitHub release with assets + checksums
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const fail = (msg, code = 1) => {
  console.error(`❌ ${msg}`);
  process.exit(code);
};

const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

const read = (p) => fs.readFileSync(p);
const write = (p, s) => fs.writeFileSync(p, s);

const input = (process.argv[2] || '').trim();
if (!input) fail('You must specify a version. Example: node github-release-helper.js 1.0.1');
const version = input.replace(/^v/i, '');
const tag = `v${version}`;

// Paths
const distDir = path.join(__dirname, 'dist');
const jsOut = path.join(distDir, 'simple-air-comfort-card.js');
const gzOut = `${jsOut}.gz`;
const checksumFile = path.join(distDir, 'checksums.txt');

try {
  // Preflight
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

  // Verify outputs
  if (!fs.existsSync(jsOut)) fail(`Build artifact missing: ${jsOut}`);
  if (!fs.existsSync(gzOut)) {
    // If postbuild didn’t gzip for some reason, do it here as a fallback.
    console.log('🗜️  Creating gzip fallback …');
    const zlib = require('zlib');
    const data = read(jsOut);
    write(gzOut, zlib.gzipSync(data));
  }

  // Checksums
  console.log('🧮 Writing checksums …');
  const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
  const lines = [
    `${path.basename(jsOut)}  ${sha256(read(jsOut))}`,
    `${path.basename(gzOut)}  ${sha256(read(gzOut))}`,
  ].join('\n') + '\n';
  write(checksumFile, lines);

  console.log(`📁 Committing and tagging ${tag} …`);
  // Force-add dist even if ignored
  run(`git add package.json package-lock.json || true`);
  run(`git add -f ${escapePath(jsOut)} ${escapePath(gzOut)} ${escapePath(checksumFile)}`);
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
  // Try a short changelog from commits since previous tag (best-effort)
  let notesFlag = `--notes "Auto release for ${tag}"`;
  try {
    const prev = execSync('git describe --tags --abbrev=0 --always --match "v*" 2>/dev/null || true').toString().trim();
    if (prev && prev !== tag) {
      const notes = execSync(`git log --pretty=format:"- %s (%h)" ${prev}..HEAD`).toString().trim();
      if (notes) {
        const tmp = path.join(__dirname, '.release-notes.tmp.md');
        write(tmp, `## Changes\n\n${notes}\n`);
        notesFlag = `--notes-file "${tmp}"`;
      }
    }
  } catch {
    // ignore
  }

  run(
    `gh release create ${tag} ` +
      `"${jsOut}" "${gzOut}" "${checksumFile}" ` +
      `--title "${tag}" ${notesFlag}`
  );

  console.log(`✅ Release ${tag} created successfully.`);
} catch (err) {
  fail(err.message || String(err));
}

function escapePath(p) {
  // crude path escaper for spaces
  return `"${p.replace(/"/g, '\\"')}"`;
}
