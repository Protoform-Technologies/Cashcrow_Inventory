const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplaceDarkClasses(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAndReplaceDarkClasses(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Remove dark variants carefully, preserving leading non-whitespace chars if any
            let newContent = content.replace(/([\'\"\`\s])(?:[A-Za-z0-9\-]+:)*dark:[A-Za-z0-9\-\/\[\]\.\:\_\#]+/g, '$1');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplaceDarkClasses(directoryPath);
console.log('Done');
