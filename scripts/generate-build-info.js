const fs = require('fs');
const { execSync } = require('child_process');

try {
  const sha = execSync('git rev-parse --short HEAD').toString().trim();
  // Get ISO date of last commit
  const date = execSync('git log -1 --format=%cI').toString().trim();
  
  const buildInfo = {
    sha: sha,
    date: date
  };
  
  fs.writeFileSync('assets/build.json', JSON.stringify(buildInfo, null, 2));
  console.log('Generated build.json with:', buildInfo);
} catch (e) {
  console.error('Error generating build info:', e.message);
}
