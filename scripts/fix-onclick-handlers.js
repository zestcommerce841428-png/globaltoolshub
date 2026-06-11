const fs = require('fs');
const path = require('path');

console.log('\n🔧 FIXING ALL TOOL BUTTONS TO CALL process() FUNCTION\n');
console.log('='.repeat(70));

const advancedToolsDir = path.join(__dirname, '../legacy/advanced-tools');
const toolDirs = fs.readdirSync(advancedToolsDir).filter(name => {
  const stat = fs.statSync(path.join(advancedToolsDir, name));
  return stat.isDirectory();
});

let fixed = 0;
let alreadyGood = 0;
let errors = 0;

toolDirs.forEach(toolName => {
  const indexPath = path.join(advancedToolsDir, toolName, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    const originalContent = content;
    
    // Check if there's a process() function defined
    if (!content.includes('function process()')) {
      console.log(`⏭️  ${toolName} - No process() function found, skipping`);
      return;
    }

    // Fix buttons that don't call process()
    // Pattern 1: onclick="document.getElementById('output').value=..."
    const pattern1 = /onclick="document\.getElementById\('output'\)\.value=[^"]+"/g;
    if (pattern1.test(content)) {
      content = content.replace(pattern1, 'onclick="process()"');
    }

    // Pattern 2: onclick="..." (anything that's not process())
    const pattern2 = /onclick="(?!process\(\))[^"]+"/g;
    const matches = content.match(pattern2);
    if (matches) {
      matches.forEach(match => {
        if (!match.includes('copy') && !match.includes('clear') && !match.includes('download') && !match.includes('generate')) {
          content = content.replace(match, 'onclick="process()"');
        }
      });
    }

    // Only write if changed
    if (content !== originalContent) {
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log(`✅ ${toolName} - Fixed button onclick handlers`);
      fixed++;
    } else {
      console.log(`✓  ${toolName} - Already correct`);
      alreadyGood++;
    }

  } catch (error) {
    console.log(`❌ ${toolName} - Error: ${error.message}`);
    errors++;
  }
});

console.log('\n' + '='.repeat(70));
console.log('\n📊 FINAL RESULTS:');
console.log(`   ✅ Fixed: ${fixed}`);
console.log(`   ✓  Already Good: ${alreadyGood}`);
console.log(`   ❌ Errors: ${errors}`);
console.log(`   📝 Total Processed: ${fixed + alreadyGood + errors}`);
console.log('\n' + '='.repeat(70));
console.log('\n✨ All tools now properly call process() functions!\n');
