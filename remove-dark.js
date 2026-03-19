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
            // Remove dark variants (with optional modifiers) and clean up extra spaces
            const newContent = content.replace(/(?:\s+|^)((?:[a-z\-]+:)*dark:[A-Za-z0-9\-\/\[\]\.\:\_\#]+)/g, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplaceDarkClasses(directoryPath);
console.log('Done');
