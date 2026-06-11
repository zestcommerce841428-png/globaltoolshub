/**
 * Comprehensive Issue Checker for GlobalToolsHub
 * Checks: broken links, missing files, JSON integrity, path consistency
 */

const fs = require('fs');
const path = require('path');

const issues = {
  brokenLinks: [],
  missingFiles: [],
  jsonErrors: [],
  pathIssues: [],
  recommendations: []
};

const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Checking GlobalToolsHub for issues...\n');

// 1. Check tools.json integrity and file existence
console.log('📋 Checking tools.json...');
try {
  const toolsPath = path.join(projectRoot, 'assets', 'tools.json');
  if (!fs.existsSync(toolsPath)) {
    issues.missingFiles.push('assets/tools.json not found');
  } else {
    const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));
    console.log(`   Found ${toolsData.length} tools in catalog`);
    
    let checkedCount = 0;
    toolsData.forEach((tool, index) => {
      // Check if URL path exists
      const toolPath = path.join(projectRoot, tool.url);
      if (!fs.existsSync(toolPath)) {
        issues.brokenLinks.push({
          tool: tool.title,
          url: tool.url,
          id: tool.id
        });
      }
      checkedCount++;
      
      // Check for required fields
      if (!tool.title || !tool.url || !tool.category || !tool.source) {
        issues.jsonErrors.push({
          index,
          id: tool.id,
          message: 'Missing required fields'
        });
      }
    });
    console.log(`   Checked ${checkedCount} tool paths`);
  }
} catch (error) {
  issues.jsonErrors.push(`tools.json parse error: ${error.message}`);
}

// 2. Check critical asset files
console.log('\n🎨 Checking critical assets...');
const criticalAssets = [
  'assets/app.js',
  'assets/components.js',
  'assets/seo-runtime.js',
  'assets/accessibility-widget.js',
  'assets/styles.css',
  'assets/logo.svg',
  'assets/build.json'
];

criticalAssets.forEach(asset => {
  const assetPath = path.join(projectRoot, asset);
  if (!fs.existsSync(assetPath)) {
    issues.missingFiles.push(asset);
  }
});

// 3. Check main HTML files
console.log('\n📄 Checking main HTML pages...');
const mainPages = [
  'index.html',
  'about.html',
  'blog.html',
  'contact.html',
  'privacy.html',
  'terms.html',
  'accessibility.html'
];

mainPages.forEach(page => {
  const pagePath = path.join(projectRoot, page);
  if (!fs.existsSync(pagePath)) {
    issues.missingFiles.push(page);
  }
});

// 4. Check legacy tool directories
console.log('\n📁 Checking legacy tool directories...');
const legacyPath = path.join(projectRoot, 'legacy');
if (fs.existsSync(legacyPath)) {
  const sources = fs.readdirSync(legacyPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  console.log(`   Found ${sources.length} legacy source directories: ${sources.join(', ')}`);
} else {
  issues.pathIssues.push('legacy/ directory not found');
}

// 5. Generate recommendations
console.log('\n💡 Generating recommendations...');

if (issues.brokenLinks.length > 0) {
  issues.recommendations.push('Fix broken tool links in tools.json');
  issues.recommendations.push('Run: node scripts/fix-broken-links.js');
}

if (issues.missingFiles.length > 0) {
  issues.recommendations.push('Restore missing critical files');
  issues.recommendations.push('Run: npm run build to regenerate assets');
}

// Generate summary report
console.log('\n' + '='.repeat(60));
console.log('📊 ISSUE REPORT SUMMARY');
console.log('='.repeat(60));

console.log(`\n🔗 Broken Links: ${issues.brokenLinks.length}`);
if (issues.brokenLinks.length > 0) {
  console.log('   First 10 broken links:');
  issues.brokenLinks.slice(0, 10).forEach(link => {
    console.log(`   ❌ ${link.tool} → ${link.url}`);
  });
  if (issues.brokenLinks.length > 10) {
    console.log(`   ... and ${issues.brokenLinks.length - 10} more`);
  }
}

console.log(`\n📦 Missing Files: ${issues.missingFiles.length}`);
if (issues.missingFiles.length > 0) {
  issues.missingFiles.forEach(file => {
    console.log(`   ❌ ${file}`);
  });
}

console.log(`\n⚠️  JSON Errors: ${issues.jsonErrors.length}`);
if (issues.jsonErrors.length > 0) {
  issues.jsonErrors.slice(0, 5).forEach(err => {
    console.log(`   ⚠️  ${err.message} (${err.id || 'unknown'})`);
  });
}

console.log(`\n🔧 Path Issues: ${issues.pathIssues.length}`);
if (issues.pathIssues.length > 0) {
  issues.pathIssues.forEach(issue => {
    console.log(`   ⚠️  ${issue}`);
  });
}

console.log('\n💡 Recommendations:');
if (issues.recommendations.length > 0) {
  issues.recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
} else {
  console.log('   ✅ No critical issues found!');
}

// Save detailed report to file
const reportPath = path.join(projectRoot, 'reports', 'issue-analysis.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
console.log(`\n💾 Detailed report saved to: reports/issue-analysis.json`);

console.log('\n' + '='.repeat(60));

// Exit with appropriate code
const totalIssues = issues.brokenLinks.length + issues.missingFiles.length + 
                   issues.jsonErrors.length + issues.pathIssues.length;
if (totalIssues > 0) {
  console.log(`\n⚠️  Found ${totalIssues} issues that need attention`);
  process.exit(1);
} else {
  console.log('\n✅ All checks passed!');
  process.exit(0);
}
