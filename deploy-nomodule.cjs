// deploy-nomodule.cjs
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Definiera sökvägar
const distDir = path.join(__dirname, 'dist-nomodule');

console.log('Förbereder för deploy av no-module-versionen...');

// Kontrollera att dist-nomodule existerar
if (!fs.existsSync(distDir)) {
  console.error('Mappen dist-nomodule finns inte. Kör npm run build:nomodule först.');
  process.exit(1);
}

try {
  // Kopiera innehållet från dist-nomodule till dist
  const distTargetDir = path.join(__dirname, 'dist');
  
  // Säkerställ att dist-mappen finns
  if (!fs.existsSync(distTargetDir)) {
    fs.mkdirSync(distTargetDir, { recursive: true });
  }
  
  // Kopiera alla filer från dist-nomodule till dist
  console.log('Kopierar filer från dist-nomodule till dist...');
  const files = fs.readdirSync(distDir);
  
  for (const file of files) {
    const sourcePath = path.join(distDir, file);
    const targetPath = path.join(distTargetDir, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      // Kopiera katalog rekursivt
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
      // Kopiera fil
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
  
  // Kör gh-pages deploy med vanlig dist-mapp
  console.log('Deploying till GitHub Pages...');
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  
  console.log('No-module-versionen har deployats till GitHub Pages!');
  console.log('Besök https://issa96-official.github.io/link-in-bio/ för att se resultatet.');
  
} catch (error) {
  console.error('Ett fel inträffade under deployen:', error);
  process.exit(1);
}
