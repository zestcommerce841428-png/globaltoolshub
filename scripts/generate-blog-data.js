/**
 * Generate blog data from all blog-*.html files
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const projectRoot = path.resolve(__dirname, '..');
const blogFiles = fs.readdirSync(projectRoot).filter(f => f.startsWith('blog-') && f.endsWith('.html'));

console.log(`\n📝 Found ${blogFiles.length} blog HTML files\n`);

const blogData = [];

for (const file of blogFiles) {
  try {
    const content = fs.readFileSync(path.join(projectRoot, file), 'utf8');
    const dom = new JSDOM(content);
    const doc = dom.window.document;
    
    const title = doc.querySelector('title')?.textContent.replace(' - GlobalToolsHub', '').trim() || 
                  doc.querySelector('h1')?.textContent.trim() || 
                  file.replace('blog-', '').replace('.html', '').replace(/-/g, ' ');
    
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
                       doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
                       doc.querySelector('p')?.textContent.trim() || 
                       'Read more about this topic on GlobalToolsHub.';
    
    // Extract category from filename or content
    let category = 'tools';
    const lowerFile = file.toLowerCase();
    if (lowerFile.includes('json') || lowerFile.includes('regex') || lowerFile.includes('api')) category = 'developer';
    else if (lowerFile.includes('seo') || lowerFile.includes('marketing') || lowerFile.includes('analytics')) category = 'seo';
    else if (lowerFile.includes('password') || lowerFile.includes('encrypt') || lowerFile.includes('security')) category = 'security';
    else if (lowerFile.includes('workflow') || lowerFile.includes('productivity')) category = 'productivity';
    
    blogData.push({
      title,
      url: file,
      category,
      excerpt: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
      date: '2026-06-01' // Default date, could extract from file stats
    });
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

// Sort by title
blogData.sort((a, b) => a.title.localeCompare(b.title));

// Save to JSON
const outputPath = path.join(projectRoot, 'assets', 'blog-data.json');
fs.writeFileSync(outputPath, JSON.stringify(blogData, null, 2));

console.log(`\n✅ Generated blog data for ${blogData.length} posts`);
console.log(`💾 Saved to: assets/blog-data.json\n`);

// Show sample
console.log('📋 Sample entries:');
blogData.slice(0, 5).forEach((post, i) => {
  console.log(`   ${i+1}. ${post.title} [${post.category}]`);
});
console.log(`   ... and ${blogData.length - 5} more\n`);

// Save report
const reportPath = path.join(projectRoot, 'reports', 'blog-integration-report.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify({
  totalFiles: blogFiles.length,
  integrated: blogData.length,
  categories: [...new Set(blogData.map(p => p.category))],
  samplePosts: blogData.slice(0, 10)
}, null, 2));

console.log(`📊 Report saved to: reports/blog-integration-report.json\n`);
