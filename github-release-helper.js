// github-release-helper.js (ESM)
#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const version = process.argv[2];
if (!version) {
  console.error('❌ Usage: node github-release-helper.js <version>');
  process.exit(1);
}

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

console.log(`📦 Updating package.json -> ${version}`);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.version = version;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

console.log('🧹 Ensuring deps are installed (npm ci) …');
run('npm ci');

console.log('🔨 Building …');
run('npm run build');

// (optional) checksum file for integrity
console.log('🧮 Writing checksums …');
run('sha256sum dist/simple-air-comfort-card.js dist/simple-air-comfort-card.js.gz dist/sac_background_overlay.svg > dist/checksums.txt');

console.log(`📁 Committing and tagging v${version} …`);
run('git add package.json dist/checksums.txt');
run(`git commit -m "chore(release): v${version}"`);
run(`git tag v${version}`);

console.log('🚀 Pushing branch and tag …');
run('git push origin main');
run(`git push origin v${version}`);

console.log('🏷  Creating GitHub release …');
// ⬇️ auto-attach built files
run(`gh release create v${version} \
  dist/simple-air-comfort-card.js \
  dist/simple-air-comfort-card.js.gz \
  dist/sac_background_overlay.svg \
  dist/checksums.txt \
  --title "v${version}" --notes "Auto release for v${version}" --latest`);

console.log(`✅ Release v${version} created successfully.`);
