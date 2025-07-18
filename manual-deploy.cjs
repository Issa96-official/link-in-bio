#!/usr/bin/env node
/**
 * Manuellt deployskript för GitHub Pages.
 * Detta script gör följande:
 * 1. Kör TypeScript-bygget
 * 2. Kör Vite-bygget med GitHub Pages-inställningar
 * 3. Förbereder dist-mappen för GitHub Pages
 * 4. Använder gh-pages för att publicera till GitHub Pages
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Logga med tidsstämplar
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

// Kör ett kommando och visa output
function runCommand(command) {
  log(`Kör: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Fel vid körning av kommandot: ${error.message}`);
    return false;
  }
}

// Huvufunktion
async function main() {
  log('Startar manuell GitHub Pages-distribution');
  
  // 1. Kör TypeScript-kompilering
  log('Kompilerar TypeScript...');
  if (!runCommand('npx tsc')) {
    log('TypeScript-kompilering misslyckades');
    process.exit(1);
  }
  
  // 2. Kör Vite-bygget
  log('Bygger med Vite...');
  if (!runCommand('npx vite build')) {
    log('Vite-byggning misslyckades');
    process.exit(1);
  }
  
  // 3. Förbered dist-mappen
  log('Förbereder dist-mappen för GitHub Pages...');
  
  const distFolder = path.join(__dirname, 'dist');
  const html404Path = path.join(__dirname, '404.html');
  const indexPath = path.join(distFolder, 'index.html');
  const distNoJekyllPath = path.join(distFolder, '.nojekyll');
  const dist404Path = path.join(distFolder, '404.html');
  
  // Kontrollera att dist-mappen finns
  if (!fs.existsSync(distFolder)) {
    log('dist-mappen finns inte! Bygget misslyckades.');
    process.exit(1);
  }
  
  // Kopiera 404.html
  if (fs.existsSync(html404Path)) {
    log('Kopierar 404.html...');
    fs.copyFileSync(html404Path, dist404Path);
  } else {
    log('Varning: 404.html finns inte i rotmappen');
  }
  
  // Skapa .nojekyll
  log('Skapar .nojekyll-fil...');
  fs.writeFileSync(distNoJekyllPath, '');
  
  // Lägg till debuggskript i index.html
  if (fs.existsSync(indexPath)) {
    log('Uppdaterar index.html med debuggskript...');
    let indexContent = fs.readFileSync(indexPath, 'utf-8');
    const debugScript = `
    <script>
      console.log('GitHub Pages build loaded at:', window.location.href);
      window.onload = function() {
        console.log('Window fully loaded');
        const rootEl = document.getElementById('root');
        if (rootEl) {
          console.log('Root element found');
          if (rootEl.childNodes.length === 0) {
            console.log('Root element is empty!');
          }
        } else {
          console.error('Root element not found!');
        }
      };
    </script>
    `;
    
    // Fix relative paths to absolute with correct base
    // För produktion, använd bara relativa sökvägar för säkerhet
    // indexContent = indexContent.replace(/src="\.\//g, 'src="/link-in-bio/');
    // indexContent = indexContent.replace(/href="\.\//g, 'href="/link-in-bio/');
    
    // Add MIME type meta tag for JavaScript
    indexContent = indexContent.replace('</head>', '<meta http-equiv="Content-Type" content="text/javascript; charset=utf-8" /></head>');
    
    // Add debug script before closing body tag
    indexContent = indexContent.replace('</body>', `${debugScript}</body>`);
    
    fs.writeFileSync(indexPath, indexContent);
  } else {
    log('Varning: index.html finns inte i dist-mappen');
  }
  
  // 4. Publicera till GitHub Pages
  log('Publicerar till GitHub Pages...');
  if (!runCommand('npx gh-pages -d dist')) {
    log('GitHub Pages-publicering misslyckades');
    process.exit(1);
  }
  
  log('GitHub Pages-distributionen är klar!');
  log('Besök https://issa96-official.github.io/link-in-bio/ för att se din sida');
}

// Kör huvudfunktionen
main().catch(error => {
  log(`Oväntat fel: ${error.message}`);
  process.exit(1);
});
