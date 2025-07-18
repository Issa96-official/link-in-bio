/**
 * This script creates a .nojekyll file in the dist folder to disable Jekyll processing
 * and fixes paths in the index.html file to ensure assets load correctly on GitHub Pages.
 */

const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Create .nojekyll file to disable Jekyll processing
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Created .nojekyll file');

// Create 404.html that redirects to index.html
const notFoundContent = fs.readFileSync(path.join(__dirname, '../public/404.html'), 'utf8');
fs.writeFileSync(path.join(distDir, '404.html'), notFoundContent);
console.log('Created 404.html file');

// Add web.config file for IIS servers
const webConfigContent = fs.readFileSync(path.join(__dirname, '../public/web.config'), 'utf8');
fs.writeFileSync(path.join(distDir, 'web.config'), webConfigContent);
console.log('Created web.config file');

// Log completion
console.log('GitHub Pages preparation completed successfully!');
