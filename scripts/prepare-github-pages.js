#!/usr/bin/env node

/**
 * Detta skript förbereder bygget för GitHub Pages genom att:
 * 1. Kopiera 404.html till dist-mappen för att hantera client-side routing
 * 2. Lägga till en .nojekyll-fil för att undvika Jekyll-bearbetning
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distFolder = path.join(__dirname, '..', 'dist');

// Kontrollera att dist-mappen finns
if (!fs.existsSync(distFolder)) {
  console.error('Dist-mappen finns inte! Kör npm run build först.');
  process.exit(1);
}

// Kopiera 404.html till dist-mappen för att hantera routing
console.log('Kopierar 404.html till dist-mappen...');
fs.copyFileSync(
  path.join(__dirname, '..', '404.html'),
  path.join(distFolder, '404.html')
);

// Skapa en .nojekyll-fil för att undvika Jekyll-bearbetning
console.log('Skapar .nojekyll-fil...');
fs.writeFileSync(path.join(distFolder, '.nojekyll'), '');

console.log('GitHub Pages-förberedelser klara!');
