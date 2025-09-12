#!/usr/bin/env node
/**
 * github-release-helper.js
 *
 * Improvements over the original:
 * - Auto-includes README/docs (git add -A), not just package.json/dist.
 * - Optional AUTO_COMMIT of dirty tree; otherwise fails fast.
 * - Pushes the CURRENT BRANCH instead of assuming "main".
 * - Uploads checksums.txt on both create and upload flows.
 * - Generates release notes from git log since the previous tag.
 * - Optionally syncs package-lock.json version to package.json (safe, optional).
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const sh  = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd)            => execSync(cmd, { encoding: 'utf8' }).trim();

// ───────────────────────────────────────────────────────────────────────────────
// Settings
// ───────────────────────────────────────────────────────────────────────────────
const version = process.argv[2];
if (!version) {
  console.error('❌ Usage: node github-release-helper.js <version>');
  process.exit(1);
}

// Auto-commit any pending changes (README/docs, etc.) before building/tagging.
// Set to false to FAIL if the working tree is dirty.
const AUTO_COMMIT = true;

// Prefix for tags (e.g., v1.2.3). Change to '' if you don’t want a 'v'.
const TAG_PREFIX = 'v';

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
const tagName = `${TAG_PREFIX}${version}`;

function tagExists(tag) {
  try { sh(`git rev-parse -q --verify refs/tags/${tag}`); return true; }
  catch { return false; }
}
function releaseExists(tag) {
  try { out(`gh release view ${tag} --json name -q .name`); return true; }
  catch { return false; }
}
function isDirty() {
  try { return out('git status --porcelain') !== ''; }
  catch { return true; }
}
function currentBranch() {
  return out('git rev-parse --abbrev-ref HEAD');
}
function latestTagOrEmpty() {
  try { return out('git describe --tags --abbrev=0'); }
  catch { return ''; }
}
function makeReleaseNotes(prevTag, newTag) {
  if (!prevTag || prevTag === newTag) {
    const log = safeOut(`git log --pretty=format:"- %s" -n 100`);
    return `Release ${newTag}\n\nChanges:\n${log || '- initial release'}`;
  }
  const log = safeOut(`git log ${prevTag}..HEAD --pretty=format:"- %s"`);
  return `Release ${newTag}\n\nChanges since ${prevTag}:\n${log || '- no changes'}`;
}
function safeOut(cmd) {
  try { return out(cmd); } catch { return ''; }
}
function ensureGhCli() {
  try { out('gh --version'); }
  catch {
    console.error('❌ GitHub CLI (gh) not found. Install from https://cli.github.com/ and authenticate with `gh auth login`.');
    process.exit(1);
  }
}
function bumpPackageLock(newVersion) {
  if (!existsSync('package-lock.json')) return;
  try {
    const lock = JSON.parse(readFileSync('package-lock.json', 'utf-8'));
    // Root version (classic field)
    if (lock.version) lock.version = newVersion;
    // npm v7+ format keeps root in packages[""]
    if (lock.packages && lock.packages[''] && lock.packages[''].version) {
      lock.packages[''].version = newVersion;
    }
    writeFileSync('package-lock.json', JSON.stringify(lock, null, 2) + '\n');
    console.log('🔒 Synced package-lock.json version →', newVersion);
  } catch (e) {
    console.warn('⚠️ Could not update package-lock.json:', e.message);
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Main
// ───────────────────────────────────────────────────────────────────────────────
try {
  ensureGhCli();

  // 1) Version bump in package.json (source of truth)
  console.log(`📦 Updating package.json -> ${version}`);
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  pkg.version = version;
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

  // Optional: keep package-lock’s top level version aligned (cosmetic)
  bumpPackageLock(version);

  // 2) Handle dirty working tree before install/build
  if (isDirty()) {
    if (AUTO_COMMIT) {
      console.log('📝 Auto-committing all changes (README, docs, etc.) …');
      sh('git add -A');
      sh(`git commit -m "chore(release): ${tagName} (include docs)" || true`);
    } else {
      console.error('❌ Working tree has uncommitted changes. Commit or enable AUTO_COMMIT.');
      process.exit(1);
    }
  }

  // 3) Install & build
  console.log('🧹 Ensuring deps are installed (npm ci) …');
  sh('npm ci');

  console.log('🔨 Building …');
  sh('npm run build');

  // 4) Checksums
  console.log('🧮 Writing checksums …');
  sh('sha256sum dist/simple-air-comfort-card.js dist/simple-air-comfort-card.js.gz dist/sac_background_overlay.svg > dist/checksums.txt');

  // 5) Commit build artifacts (+ package.json/lock) if changed
  console.log(`📁 Committing build artifacts for ${tagName} …`);
  sh('git add -A');
  sh(`git commit -m "chore(release): ${tagName}" || true`);

  // 6) Tag + push
  const branch = currentBranch();
  if (!tagExists(tagName)) {
    console.log(`🔖 Creating tag ${tagName} …`);
    sh(`git tag ${tagName}`);
    console.log(`📤 Pushing ${branch} and ${tagName} …`);
    sh(`git push origin ${branch}`);
    sh(`git push origin ${tagName}`);
  } else {
    console.log('ℹ️ Tag already exists; pushing branch to ensure remote is up-to-date …');
    sh(`git push origin ${branch}`);
  }

  // 7) Release notes
  const prev = latestTagOrEmpty();
  const notes = makeReleaseNotes(prev, tagName).replace(/"/g, '\\"');
  const isPrerelease = (process.env.CHANNEL || '').toLowerCase() === 'dev';
  const prereleaseFlags = isPrerelease ? '--prerelease --latest=false' : '';

  // 8) GitHub Release (create or upload, always include checksums)
  if (!releaseExists(tagName)) {
    console.log('🏷  Creating GitHub release …');
    sh(`gh release create ${tagName} \
      dist/simple-air-comfort-card.js \
      dist/simple-air-comfort-card.js.gz \
      dist/sac_background_overlay.svg \
      dist/checksums.txt \
      --title "${tagName}" --notes "${notes}" ${prereleaseFlags}
  } else {
    console.log('📤 Release exists; uploading assets (clobber) …');
    sh(`gh release upload ${tagName} \
      dist/simple-air-comfort-card.js \
      dist/simple-air-comfort-card.js.gz \
      dist/sac_background_overlay.svg \
      dist/checksums.txt \
      --clobber`);
  }

  console.log('✅ Done.');
} catch (e) {
  console.error('❌ Release failed:', e?.message || e);
  process.exit(1);
}
