// github-release-helper.js
// Place this at the root of your HACS repo

const fs = require('fs');
const { execSync } = require('child_process');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node github-release-helper.js <version>');
  process.exit(1);
}

// 1. Update package.json
const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

// 2. Commit version bump
execSync(`git add package.json`, { stdio: 'inherit' });
execSync(`git commit -m "release: v${version}"`, { stdio: 'inherit' });

// 3. Create tag
execSync(`git tag v${version}`, { stdio: 'inherit' });

// 4. Push tag and main
execSync(`git push origin main --tags`, { stdio: 'inherit' });

// 5. Create release via GitHub CLI
try {
  execSync(`gh release create v${version} --title "v${version}" --notes "Release v${version}"`, {
    stdio: 'inherit',
  });
} catch (err) {
  console.error('Failed to create GitHub release:', err.message);
}
