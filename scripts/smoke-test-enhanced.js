/**
 * Enhanced Smoke Test for GlobalToolsHub
 * Tests actual tool functionality using Puppeteer
 */

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('serve-handler');

const PORT = 5555;
const BASE_URL = `http://localhost:${PORT}`;
const projectRoot = path.resolve(__dirname, '..');

// Start local server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((request, response) => {
      return handler(request, response, {
        public: projectRoot,
        headers: [
          {
            source: '**/*',
            headers: [{
              key: 'Cache-Control',
              value: 'no-cache'
            }]
          }
        ]
      });
    });
    
    server.listen(PORT, () => {
      console.log(`✅ Test server running at ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function runTests() {
  console.log('🚀 Starting Enhanced Smoke Test for GlobalToolsHub\n');
  
  const server = await startServer();
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  try {
    // Test 1: Main Index Page
    console.log('📄 Testing index.html...');
    const indexPage = await browser.newPage();
    indexPage.on('console', msg => {
      if (msg.type() === 'error') {
        results.warnings.push(`Console error on index: ${msg.text()}`);
      }
    });
    
    await indexPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2', timeout: 10000 });
    
    const indexTitle = await indexPage.title();
    if (indexTitle.includes('GlobalToolsHub')) {
      results.passed.push('✅ Index page loaded successfully');
    } else {
      results.failed.push('❌ Index page title incorrect');
    }
    
    // Check if tools loaded
    const toolCount = await indexPage.evaluate(() => {
      const countEl = document.querySelector('#resultCount');
      return countEl ? countEl.textContent : '0';
    });
    
    if (toolCount && toolCount !== '0 tools') {
      results.passed.push(`✅ Tools catalog loaded: ${toolCount}`);
    } else {
      results.failed.push('❌ Tools catalog failed to load');
    }
    
    // Check for critical elements
    const hasSearch = await indexPage.$('#searchInput');
    const hasGrid = await indexPage.$('#toolsGrid');
    const hasHeader = await indexPage.$('global-header');
    const hasFooter = await indexPage.$('global-footer');
    
    if (hasSearch) results.passed.push('✅ Search input present');
    else results.failed.push('❌ Search input missing');
    
    if (hasGrid) results.passed.push('✅ Tools grid present');
    else results.failed.push('❌ Tools grid missing');
    
    if (hasHeader) results.passed.push('✅ Global header component loaded');
    else results.failed.push('❌ Global header component missing');
    
    if (hasFooter) results.passed.push('✅ Global footer component loaded');
    else results.failed.push('❌ Global footer component missing');
    
    await indexPage.close();
    
    // Test 2: Sample Tool Pages
    console.log('\n🔧 Testing sample tool pages...');
    const toolsData = JSON.parse(fs.readFileSync(path.join(projectRoot, 'assets', 'tools.json'), 'utf8'));
    const sampleTools = toolsData.slice(0, 5); // Test first 5 tools
    
    for (const tool of sampleTools) {
      const toolPage = await browser.newPage();
      const errors = [];
      
      toolPage.on('pageerror', error => {
        errors.push(error.message);
      });
      
      try {
        await toolPage.goto(`${BASE_URL}/${tool.url}`, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const title = await toolPage.title();
        
        if (errors.length === 0) {
          results.passed.push(`✅ ${tool.title} - loaded without errors`);
        } else {
          results.warnings.push(`⚠️  ${tool.title} - ${errors.length} runtime error(s)`);
        }
      } catch (error) {
        results.failed.push(`❌ ${tool.title} - failed to load: ${error.message}`);
      }
      
      await toolPage.close();
    }
    
    // Test 3: Navigation Pages
    console.log('\n📋 Testing navigation pages...');
    const navPages = ['about.html', 'blog.html', 'contact.html', 'privacy.html'];
    
    for (const pageName of navPages) {
      const navPage = await browser.newPage();
      try {
        await navPage.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
        results.passed.push(`✅ ${pageName} loaded`);
      } catch (error) {
        results.failed.push(`❌ ${pageName} failed: ${error.message}`);
      }
      await navPage.close();
    }
    
    // Test 4: Web Components
    console.log('\n🧩 Testing web components...');
    const componentPage = await browser.newPage();
    await componentPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2', timeout: 10000 });
    
    const headerContent = await componentPage.evaluate(() => {
      const header = document.querySelector('global-header');
      return header ? header.innerHTML.length > 0 : false;
    });
    
    const footerContent = await componentPage.evaluate(() => {
      const footer = document.querySelector('global-footer');
      return footer ? footer.innerHTML.length > 0 : false;
    });
    
    if (headerContent) results.passed.push('✅ Header component rendered');
    else results.failed.push('❌ Header component not rendered');
    
    if (footerContent) results.passed.push('✅ Footer component rendered');
    else results.failed.push('❌ Footer component not rendered');
    
    await componentPage.close();
    
    // Test 5: Search Functionality
    console.log('\n🔍 Testing search functionality...');
    const searchPage = await browser.newPage();
    await searchPage.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2', timeout: 10000 });
    
    await searchPage.type('#searchInput', 'json');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const searchResults = await searchPage.evaluate(() => {
      const countEl = document.querySelector('#resultCount');
      return countEl ? countEl.textContent : '0';
    });
    
    if (searchResults && searchResults !== '0 tools') {
      results.passed.push(`✅ Search working: ${searchResults} for "json"`);
    } else {
      results.failed.push('❌ Search not working');
    }
    
    await searchPage.close();
    
  } catch (error) {
    results.failed.push(`❌ Test suite error: ${error.message}`);
  } finally {
    await browser.close();
    server.close();
  }
  
  // Print Results
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\n✅ PASSED: ${results.passed.length}`);
  results.passed.forEach(msg => console.log(`   ${msg}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS: ${results.warnings.length}`);
    results.warnings.forEach(msg => console.log(`   ${msg}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED: ${results.failed.length}`);
    results.failed.forEach(msg => console.log(`   ${msg}`));
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Save report
  const reportPath = path.join(projectRoot, 'reports', 'smoke-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Detailed report saved to: reports/smoke-test-results.json`);
  
  const totalTests = results.passed.length + results.failed.length + results.warnings.length;
  const successRate = ((results.passed.length / (totalTests - results.warnings.length)) * 100).toFixed(1);
  console.log(`\n📈 Success Rate: ${successRate}% (${results.passed.length}/${totalTests - results.warnings.length})`);
  
  if (results.failed.length > 0) {
    console.log('\n⚠️  Some tests failed. Review the report above.');
    process.exit(1);
  } else {
    console.log('\n✅ All critical tests passed!');
    process.exit(0);
  }
}

runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
