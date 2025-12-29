const fs = require('fs');

// Read the HTML file
const htmlPath = './index.html';
let content = fs.readFileSync(htmlPath, 'utf8');

// Remove all data-problem attributes
content = content.replace(/ data-problem="[^"]*"/g, '');

// Write back the modified content
fs.writeFileSync(htmlPath, content, 'utf8');

console.log('Successfully removed all data-problem attributes from index.html');
