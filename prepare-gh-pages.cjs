/**
 * Detta skript förbereder bygget för GitHub Pages genom att:
 * 1. Kopiera 404.html till dist-mappen för att hantera client-side routing
 * 2. Lägga till en .nojekyll-fil för att undvika Jekyll-bearbetning
 * 3. Lägga till ett demo-läge som fungerar utan backend
 */

const fs = require('fs');
const path = require('path');

// Sökvägar
const distFolder = path.join(__dirname, 'dist');
const html404Path = path.join(__dirname, '404.html');
const indexPath = path.join(distFolder, 'index.html');
const distNoJekyllPath = path.join(distFolder, '.nojekyll');
const dist404Path = path.join(distFolder, '404.html');

// Kontrollera att dist-mappen finns
if (!fs.existsSync(distFolder)) {
  console.error('Dist-mappen finns inte! Kör npm run build först.');
  process.exit(1);
}

// Kontrollera att 404.html finns
if (!fs.existsSync(html404Path)) {
  console.error('404.html finns inte i rotmappen!');
  process.exit(1);
}

// Kopiera 404.html till dist-mappen
console.log('Kopierar 404.html till dist-mappen...');
fs.copyFileSync(html404Path, dist404Path);

// Skapa en .nojekyll-fil
console.log('Skapar .nojekyll-fil...');
fs.writeFileSync(distNoJekyllPath, '');

// Läs in index.html och ändra script-sökvägen
console.log('Uppdaterar index.html...');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Lägg till extra debuggskript
const debugScript = `
<script>
  window.onload = function() {
    console.log('Window loaded!');
    console.log('URL:', window.location.href);
    // Kontrollera om root-elementet finns
    const root = document.getElementById('root');
    if (root) {
      console.log('Root element found!');
    } else {
      console.error('Root element not found!');
      // Skapa root-element manuellt
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      console.log('Created new root element');
    }
  };
</script>
`;

// Lägg till skriptet precis innan </body>
indexContent = indexContent.replace('</body>', `${debugScript}</body>`);

// Skriv tillbaka den uppdaterade filen
fs.writeFileSync(indexPath, indexContent);

console.log('GitHub Pages-förberedelser klara!');
