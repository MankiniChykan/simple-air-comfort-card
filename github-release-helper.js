#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const sh = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });
const out = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

const version = process.argv[2];
if (!version) {
  console.error('❌ Usage: node github-release-helper.js <version>');
  process.exit(1);
}

function tagExists(tag) {
  try { sh(`git rev-parse -q --verify refs/tags/${tag}`); return true; }
  catch { return false; }
}
function releaseExists(tag) {
  try { out(`gh release view ${tag} --json name -q .name`); return true; }
  catch { return false; }
}

try {
  console.log(`📦 Updating package.json -> ${version}`);
  const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
  pkg.version = version;
  writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

  console.log('🧹 Ensuring deps are installed (npm ci) …');
  sh('npm ci');

  console.log('🔨 Building …');
  sh('npm run build');

  console.log('🧮 Writing checksums …');
  sh('sha256sum dist/simple-air-comfort-card.js dist/simple-air-comfort-card.js.gz dist/sac_background_overlay.svg > dist/checksums.txt');

  console.log(`📁 Committing${tagExists(`v${version}`) ? '' : ' and tagging'} v${version} …`);
  sh('git add package.json dist && git commit -m "chore(release): v' + version + '" || true');

  if (!tagExists(`v${version}`)) {
    sh(`git tag v${version}`);
    sh(`git push origin main`);
    sh(`git push origin v${version}`);
  } else {
    // Ensure branch push still happens
    sh(`git push origin main`);
  }

  if (!releaseExists(`v${version}`)) {
    console.log('🏷  Creating GitHub release …');
    sh(`gh release create v${version} \
      dist/simple-air-comfort-card.js \
      dist/simple-air-comfort-card.js.gz \
      dist/sac_background_overlay.svg \
      --title "v${version}" --notes "Release v${version}"`);
  } else {
    console.log('📤 Release exists; uploading assets (clobber) …');
    sh(`gh release upload v${version} \
      dist/simple-air-comfort-card.js \
      dist/simple-air-comfort-card.js.gz \
      dist/sac_background_overlay.svg \
      dist/checksums.txt \
      --clobber`);
  }

  console.log(`✅ Done.`);
} catch (e) {
  console.error('❌ Release failed:', e.message);
  process.exit(1);
}
