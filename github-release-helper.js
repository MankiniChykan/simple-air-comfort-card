// github-release-helper.js

const { execSync } = require('child_process');
const fs = require('fs');

const version = process.argv[2];

if (!version) {
  console.error('❌ Please provide a version number. Example: node github-release-helper.js 1.0.0');
  process.exit(1);
}

try {
  console.log(`\n🔄 Updating package.json to version ${version}`);
  const pkg = JSON.parse(fs.readFileSync('package.json'));
  pkg.version = version;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

  console.log('✅ Committing version bump');
  execSync(`git add package.json`);
  execSync(`git commit -m "release: bump version to ${version}"`);

  console.log(`🏷 Tagging version v${version}`);
  execSync(`git tag v${version}`);

  console.log('⬆️ Pushing commit and tag');
  execSync(`git push`);
  execSync(`git push origin v${version}`);

  console.log('🚀 Creating GitHub release');
  execSync(`gh release create v${version} --title "v${version}" --generate-notes`);

  console.log(`\n🎉 Release v${version} complete!`);

} catch (err) {
  console.error(`❌ Failed: ${err.message}`);
  process.exit(1);
}
