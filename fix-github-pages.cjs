// Fix for GitHub Pages build error
// This script is run after the build but before the gh-pages deploy
const fs = require('fs');
const path = require('path');

console.log('Starting GitHub Pages preparation...');

// Copy the index.html to the dist folder
const distPath = path.join(__dirname, 'dist');
const distIndexPath = path.join(distPath, 'index.html');

// Check if the dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

// Read the current index.html
let indexContent = '';
if (fs.existsSync(distIndexPath)) {
  indexContent = fs.readFileSync(distIndexPath, 'utf8');
  console.log('Read existing index.html in dist folder');
} else {
  console.error('Error: No index.html found in dist folder');
  process.exit(1);
}

// Fix the script paths to point to the assets directory
indexContent = indexContent.replace(
  /<script type="module" src="\/link-in-bio\/src\/main.tsx"><\/script>/,
  '<script type="module" src="./assets/index.js"></script>'
);

// Add debugging info
indexContent = indexContent.replace(
  '</head>',
  `<script>
    console.log('Built for GitHub Pages');
    console.log('Base URL:', window.location.href);
  </script>
</head>`
);

// Write the fixed index.html
fs.writeFileSync(distIndexPath, indexContent);
console.log('Updated index.html with correct script paths');

// Create a .nojekyll file to prevent GitHub Pages from ignoring files that start with an underscore
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');
console.log('Created .nojekyll file');

// Copy 404.html to the dist folder
const html404Path = path.join(__dirname, '404.html');
if (fs.existsSync(html404Path)) {
  fs.copyFileSync(html404Path, path.join(distPath, '404.html'));
  console.log('Copied 404.html to dist folder');
} else {
  console.log('No 404.html found in root, creating a basic one');
  const basic404 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Not Found</title>
  <script>
    // Redirect to the main page with a hash router path
    window.location.href = '/link-in-bio/#' + window.location.pathname.replace('/link-in-bio', '');
  </script>
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>
  `;
  fs.writeFileSync(path.join(distPath, '404.html'), basic404);
  console.log('Created basic 404.html in dist folder');
}

console.log('GitHub Pages preparation completed successfully!');
