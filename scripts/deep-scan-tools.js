/**
 * Deep Tool Functionality Scanner
 * Identifies placeholder tools, broken UI, and redirect-only pages
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const results = {
  redirectOnlyPages: [],
  placeholderTools: [],
  brokenUI: [],
  missingImplementation: [],
  workingTools: [],
  blogPages: { total: 0, integrated: 0, broken: [] }
};

console.log('🔍 DEEP SCANNING GlobalToolsHub for Placeholder & Broken Tools\n');
console.log('='.repeat(70));

// Load tools.json
const toolsData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'assets', 'tools.json'), 'utf8'));
console.log(`\n📦 Analyzing ${toolsData.length} tools from catalog...\n`);

// Check each tool's actual implementation
let checked = 0;
for (const tool of toolsData) {
  checked++;
  const toolPath = path.join(projectRoot, tool.url);
  
  if (!fs.existsSync(toolPath)) {
    results.missingImplementation.push({ ...tool, reason: 'File not found' });
    continue;
  }
  
  try {
    const content = fs.readFileSync(toolPath, 'utf8');
    const dom = new JSDOM(content);
    const doc = dom.window.document;
    
    // Check 1: Is it a redirect-only page?
    const metaRefresh = doc.querySelector('meta[http-equiv="refresh"]');
    const hasRedirectScript = content.includes('window.location.href') || content.includes('window.location.replace');
    const bodyContent = doc.body ? doc.body.textContent.trim() : '';
    
    if ((metaRefresh || hasRedirectScript) && bodyContent.length < 100) {
      results.redirectOnlyPages.push({
        ...tool,
        redirectTo: metaRefresh ? metaRefresh.getAttribute('content') : 'JavaScript redirect'
      });
      continue;
    }
    
    // Check 2: Is it a placeholder (minimal content)?
    const hasTextarea = doc.querySelector('textarea');
    const hasInput = doc.querySelector('input[type="text"], input[type="file"]');
    const hasCanvas = doc.querySelector('canvas');
    const hasButton = doc.querySelector('button');
    const scriptTags = doc.querySelectorAll('script:not([src])');
    
    const hasInteractiveElements = hasTextarea || hasInput || hasCanvas || hasButton;
    const hasInlineScript = Array.from(scriptTags).some(script => 
      script.textContent.length > 100 && !script.textContent.includes('gtag')
    );
    
    if (!hasInteractiveElements && !hasInlineScript && bodyContent.length < 500) {
      results.placeholderTools.push({
        ...tool,
        reason: 'No interactive elements or significant content',
        bodyLength: bodyContent.length
      });
      continue;
    }
    
    // Check 3: Broken UI indicators
    const warnings = [];
    if (!doc.querySelector('h1, h2, .title, header h1')) warnings.push('No heading');
    if (bodyContent.length < 200) warnings.push('Very short content');
    if (!hasButton && !doc.querySelector('a.button, .btn')) warnings.push('No action buttons');
    
    if (warnings.length >= 2) {
      results.brokenUI.push({ ...tool, warnings });
      continue;
    }
    
    // Passed all checks
    results.workingTools.push(tool);
    
  } catch (error) {
    results.brokenUI.push({ ...tool, error: error.message });
  }
  
  if (checked % 50 === 0) {
    console.log(`   Processed ${checked}/${toolsData.length} tools...`);
  }
}

console.log(`\n✅ Completed scanning ${checked} tools\n`);

// Check blog pages
console.log('📝 Scanning blog pages...\n');
const blogFiles = fs.readdirSync(projectRoot).filter(f => f.startsWith('blog-') && f.endsWith('.html'));
results.blogPages.total = blogFiles.length;

for (const blogFile of blogFiles) {
  try {
    const content = fs.readFileSync(path.join(projectRoot, blogFile), 'utf8');
    const dom = new JSDOM(content);
    const doc = dom.window.document;
    
    const hasArticle = doc.querySelector('article, .blog-post, .post-content');
    const hasHeading = doc.querySelector('h1, h2');
    const bodyContent = doc.body ? doc.body.textContent.trim() : '';
    
    if (hasArticle && hasHeading && bodyContent.length > 500) {
      results.blogPages.integrated++;
    } else {
      results.blogPages.broken.push({
        file: blogFile,
        issues: [
          !hasArticle && 'No article content',
          !hasHeading && 'No heading',
          bodyContent.length < 500 && 'Too short'
        ].filter(Boolean)
      });
    }
  } catch (error) {
    results.blogPages.broken.push({ file: blogFile, error: error.message });
  }
}

// Generate Report
console.log('='.repeat(70));
console.log('📊 DEEP SCAN RESULTS');
console.log('='.repeat(70));

console.log(`\n🚨 REDIRECT-ONLY PAGES: ${results.redirectOnlyPages.length}`);
if (results.redirectOnlyPages.length > 0) {
  console.log('   These are NOT real tools, just redirect pages:');
  results.redirectOnlyPages.slice(0, 20).forEach((tool, i) => {
    console.log(`   ${i+1}. ${tool.title} → ${tool.redirectTo}`);
  });
  if (results.redirectOnlyPages.length > 20) {
    console.log(`   ... and ${results.redirectOnlyPages.length - 20} more`);
  }
}

console.log(`\n⚠️  PLACEHOLDER TOOLS: ${results.placeholderTools.length}`);
if (results.placeholderTools.length > 0) {
  console.log('   These tools have minimal or no implementation:');
  results.placeholderTools.slice(0, 15).forEach((tool, i) => {
    console.log(`   ${i+1}. ${tool.title} - ${tool.reason}`);
  });
  if (results.placeholderTools.length > 15) {
    console.log(`   ... and ${results.placeholderTools.length - 15} more`);
  }
}

console.log(`\n🔧 BROKEN UI: ${results.brokenUI.length}`);
if (results.brokenUI.length > 0) {
  console.log('   These tools have UI issues:');
  results.brokenUI.slice(0, 10).forEach((tool, i) => {
    const issues = tool.warnings ? tool.warnings.join(', ') : tool.error;
    console.log(`   ${i+1}. ${tool.title} - ${issues}`);
  });
  if (results.brokenUI.length > 10) {
    console.log(`   ... and ${results.brokenUI.length - 10} more`);
  }
}

console.log(`\n❌ MISSING FILES: ${results.missingImplementation.length}`);
if (results.missingImplementation.length > 0) {
  results.missingImplementation.forEach((tool, i) => {
    console.log(`   ${i+1}. ${tool.title} - ${tool.url}`);
  });
}

console.log(`\n✅ WORKING TOOLS: ${results.workingTools.length}`);

console.log(`\n📝 BLOG PAGES: ${results.blogPages.integrated}/${results.blogPages.total} integrated`);
if (results.blogPages.broken.length > 0) {
  console.log(`   ${results.blogPages.broken.length} blog pages need work:`);
  results.blogPages.broken.slice(0, 10).forEach((blog, i) => {
    const issues = blog.issues ? blog.issues.join(', ') : blog.error;
    console.log(`   ${i+1}. ${blog.file} - ${issues}`);
  });
}

// Summary calculations
const totalIssues = results.redirectOnlyPages.length + results.placeholderTools.length + 
                   results.brokenUI.length + results.missingImplementation.length;
const actualWorkingTools = results.workingTools.length;
const totalTools = toolsData.length;
const workingPercentage = ((actualWorkingTools / totalTools) * 100).toFixed(1);

console.log('\n' + '='.repeat(70));
console.log('📈 SUMMARY');
console.log('='.repeat(70));
console.log(`\nTotal Tools in Catalog: ${totalTools}`);
console.log(`Actually Working Tools: ${actualWorkingTools} (${workingPercentage}%)`);
console.log(`\nIssue Breakdown:`);
console.log(`  - Redirect-Only: ${results.redirectOnlyPages.length}`);
console.log(`  - Placeholders: ${results.placeholderTools.length}`);
console.log(`  - Broken UI: ${results.brokenUI.length}`);
console.log(`  - Missing Files: ${results.missingImplementation.length}`);
console.log(`  - Blog Issues: ${results.blogPages.broken.length}/${results.blogPages.total}`);
console.log(`\nTotal Issues Found: ${totalIssues + results.blogPages.broken.length}`);

// Save detailed report
const reportPath = path.join(projectRoot, 'reports', 'deep-scan-results.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n💾 Detailed report saved to: reports/deep-scan-results.json`);

// Generate fix recommendations
console.log('\n' + '='.repeat(70));
console.log('🔧 RECOMMENDED FIXES');
console.log('='.repeat(70));
console.log('\n1. Convert redirect pages to actual tool implementations');
console.log('2. Implement placeholder tools with real functionality');
console.log('3. Fix broken UI elements (add headings, buttons, content)');
console.log('4. Integrate blog pages properly with content');
console.log('5. Remove or fix missing tool entries from tools.json');
console.log('\n💡 Run: node scripts/fix-broken-tools.js (to be created)');
console.log('='.repeat(70) + '\n');

process.exit(totalIssues > 0 ? 1 : 0);
