#!/usr/bin/env node

/**
 * GitHub Release Helper Script
 * Usage: node github-release-helper.js <version>
 */

const fs = require('fs');
const { execSync } = require('child_process');

const version = process.argv[2];
if (!version) {
  console.error('❌ You must specify a version number. Example: node github-release-helper.js 1.0.0');
  process.exit(1);
}

try {
  console.log(`📦 Updating package.json to version ${version}...`);
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  packageJson.version = version;
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');

  console.log(`📁 Committing and tagging release v${version}...`);
  execSync(`git add package.json`, { stdio: 'inherit' });
  execSync(`git commit -m "chore(release): v${version}"`, { stdio: 'inherit' });
  execSync(`git tag v${version}`, { stdio: 'inherit' });

  console.log('🚀 Pushing changes and tag to GitHub...');
  execSync(`git push origin main`, { stdio: 'inherit' });
  execSync(`git push origin v${version}`, { stdio: 'inherit' });

  console.log('🏷  Creating GitHub release...');
  execSync(`gh release create v${version} --title "v${version}" --notes "Auto release for v${version}"`, { stdio: 'inherit' });

  console.log(`✅ Release v${version} created successfully.`);
} catch (err) {
  console.error('❌ An error occurred during release process:', err.message);
  process.exit(1);
}
