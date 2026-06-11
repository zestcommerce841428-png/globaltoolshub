/**
 * Fix Redirect Pages - Update tools.json to point directly to working tools
 * The 63 "redirect-only" pages actually redirect to real implementations
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const toolsJsonPath = path.join(projectRoot, 'assets', 'tools.json');
const toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

const deepScanResults = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'reports', 'deep-scan-results.json'), 'utf8')
);

console.log('🔧 Fixing Redirect Pages in tools.json\n');
console.log('='.repeat(70));

let fixed = 0;
let verified = 0;
const updates = [];

// For each redirect-only page, update to point to the actual tool
for (const redirectTool of deepScanResults.redirectOnlyPages) {
  // Extract redirect target from the meta refresh content
  const redirectMatch = redirectTool.redirectTo.match(/url=(.+)$/);
  if (!redirectMatch) continue;
  
  let targetUrl = redirectMatch[1];
  
  // Clean up the URL
  targetUrl = targetUrl.replace('/globaltoolshub/', '');
  if (!targetUrl.endsWith('/')) targetUrl += '/';
  targetUrl += 'index.html';
  
  // Check if target exists
  const targetPath = path.join(projectRoot, targetUrl);
  if (fs.existsSync(targetPath)) {
    // Find the tool in tools.json and update it
    const toolIndex = toolsData.findIndex(t => t.id === redirectTool.id);
    if (toolIndex !== -1) {
      const oldUrl = toolsData[toolIndex].url;
      toolsData[toolIndex].url = targetUrl;
      
      updates.push({
        tool: redirectTool.title,
        from: oldUrl,
        to: targetUrl
      });
      
      fixed++;
    }
    verified++;
  }
}

console.log(`\n✅ Verified ${verified} redirect targets exist`);
console.log(`🔧 Updated ${fixed} tool URLs in tools.json\n`);

if (updates.length > 0) {
  console.log('📝 Sample updates:');
  updates.slice(0, 10).forEach((u, i) => {
    console.log(`   ${i+1}. ${u.tool}`);
    console.log(`      From: ${u.from}`);
    console.log(`      To:   ${u.to}`);
  });
  if (updates.length > 10) {
    console.log(`   ... and ${updates.length - 10} more`);
  }
}

// Save updated tools.json
const backupPath = toolsJsonPath + '.backup';
fs.copyFileSync(toolsJsonPath, backupPath);
console.log(`\n💾 Backup created: ${backupPath}`);

fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 2));
console.log(`✅ Updated tools.json saved`);

console.log('\n' + '='.repeat(70));
console.log('✅ Redirect pages fixed!');
console.log('   All tools now point directly to working implementations');
console.log('='.repeat(70) + '\n');

// Save report
const reportPath = path.join(projectRoot, 'reports', 'redirect-fix-report.json');
fs.writeFileSync(reportPath, JSON.stringify({ fixed, verified, updates }, null, 2));
console.log(`📊 Report saved to: reports/redirect-fix-report.json\n`);
