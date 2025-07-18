// copy-debug-files.cjs
const fs = require('fs');
const path = require('path');

console.log('Kopierar felsökningsfiler till dist-mappen...');

const distDir = path.join(__dirname, 'dist');

// Kontrollera om dist-mappen finns
if (!fs.existsSync(distDir)) {
  console.error('Fel: dist-mappen finns inte. Kör build först.');
  process.exit(1);
}

// Kopiera debug.js
const debugJsPath = path.join(__dirname, 'debug.js');
if (fs.existsSync(debugJsPath)) {
  fs.copyFileSync(debugJsPath, path.join(distDir, 'debug.js'));
  console.log('Kopierade debug.js till dist-mappen');
} else {
  console.error('Fel: debug.js finns inte');
}

// Kopiera direct-loader.html
const directLoaderPath = path.join(__dirname, 'direct-loader.html');
if (fs.existsSync(directLoaderPath)) {
  fs.copyFileSync(directLoaderPath, path.join(distDir, 'direct-loader.html'));
  console.log('Kopierade direct-loader.html till dist-mappen');
} else {
  console.error('Fel: direct-loader.html finns inte');
}

// Kopiera minimal-loader.html
const minimalLoaderPath = path.join(__dirname, 'minimal-loader.html');
if (fs.existsSync(minimalLoaderPath)) {
  fs.copyFileSync(minimalLoaderPath, path.join(distDir, 'minimal-loader.html'));
  console.log('Kopierade minimal-loader.html till dist-mappen');
} else {
  console.error('Fel: minimal-loader.html finns inte');
}

// Kopiera deploy.html
const deployHtmlPath = path.join(__dirname, 'deploy.html');
if (fs.existsSync(deployHtmlPath)) {
  fs.copyFileSync(deployHtmlPath, path.join(distDir, 'deploy.html'));
  console.log('Kopierade deploy.html till dist-mappen');
} else {
  console.error('Fel: deploy.html finns inte');
}

// Skapa .nojekyll-fil (för GitHub Pages)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
console.log('Skapade .nojekyll-fil');

// Kopiera index.html till 404.html (för SPA-beteende)
const indexHtmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  fs.copyFileSync(indexHtmlPath, path.join(distDir, '404.html'));
  console.log('Kopierade index.html till 404.html');
} else {
  console.error('Fel: index.html finns inte i dist-mappen');
}

console.log('Kopiering av felsökningsfiler klar!');
