#!/usr/bin/env node

/**
 * Detta skript förbereder bygget för GitHub Pages genom att:
 * 1. Kopiera 404.html till dist-mappen för att hantera client-side routing
 * 2. Lägga till en .nojekyll-fil för att undvika Jekyll-bearbetning
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Kör bygget först
console.log('Bygger projektet...');
execSync('npm run build', { stdio: 'inherit' });

const distFolder = path.join(__dirname, 'dist');

// Kontrollera att dist-mappen finns
if (!fs.existsSync(distFolder)) {
  console.error('Dist-mappen skapades inte! Något gick fel under bygget.');
  process.exit(1);
}

// Kopiera 404.html till dist-mappen för att hantera routing
console.log('Kopierar 404.html till dist-mappen...');
fs.copyFileSync(
  path.join(__dirname, '404.html'),
  path.join(distFolder, '404.html')
);

// Skapa en .nojekyll-fil för att undvika Jekyll-bearbetning
console.log('Skapar .nojekyll-fil...');
fs.writeFileSync(path.join(distFolder, '.nojekyll'), '');

console.log('GitHub Pages-förberedelser klara!');
