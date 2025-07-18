#!/usr/bin/env node

/**
 * Detta skript förbereder bygget för GitHub Pages genom att:
 * 1. Kopiera index.html till 404.html för att hantera client-side routing
 * 2. Lägga till en .nojekyll-fil för att undvika Jekyll-bearbetning
 */

const fs = require('fs');
const path = require('path');

const distFolder = path.join(__dirname, 'dist');

// Kontrollera att dist-mappen finns
if (!fs.existsSync(distFolder)) {
  console.error('Dist-mappen finns inte! Kör npm run build först.');
  process.exit(1);
}

// Kopiera index.html till 404.html för att hantera routing
console.log('Kopierar index.html till 404.html...');
fs.copyFileSync(
  path.join(distFolder, 'index.html'),
  path.join(distFolder, '404.html')
);

// Skapa en .nojekyll-fil för att undvika Jekyll-bearbetning
console.log('Skapar .nojekyll-fil...');
fs.writeFileSync(path.join(distFolder, '.nojekyll'), '');

console.log('GitHub Pages-förberedelser klara!');
