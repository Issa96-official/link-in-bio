// build-nomodule.cjs
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Definiera sökvägar
const distDir = path.join(__dirname, 'dist-nomodule');

console.log('Bygger version utan ES-moduler för bättre kompatibilitet...');

try {
  // Kör Vite build med vår speciella konfiguration
  execSync('npx vite build --config vite.config.nomodule.js', { stdio: 'inherit' });
  
  console.log('Build klar, kopierar extra filer...');
  
  // Skapa .nojekyll fil för GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('Skapade .nojekyll fil');
  
  // Kopiera no-module-loader.html till dist-nomodule/index.html
  const loaderContent = fs.readFileSync(path.join(__dirname, 'no-module-loader.html'), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'index.html'), loaderContent);
  console.log('Kopierade no-module-loader.html till index.html');
  
  // Skapa en 404.html fil som är identisk med index.html
  fs.writeFileSync(path.join(distDir, '404.html'), loaderContent);
  console.log('Skapade 404.html');
  
  // Skapa web.config för att hantera MIME-typer
  const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <remove fileExtension=".js" />
      <mimeMap fileExtension=".js" mimeType="text/javascript" />
      <remove fileExtension=".jsx" />
      <mimeMap fileExtension=".jsx" mimeType="text/javascript" />
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".css" />
      <mimeMap fileExtension=".css" mimeType="text/css" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>`;
  fs.writeFileSync(path.join(distDir, 'web.config'), webConfigContent);
  console.log('Skapade web.config');
  
  // Skapa .htaccess för Apache-servrar
  const htaccessContent = `
# Sätt korrekta MIME-typer
AddType text/javascript .js
AddType text/javascript .jsx
AddType application/json .json
AddType text/css .css

# Stäng av MIME-type sniffing
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
</IfModule>

# Rewrite-regler för SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /link-in-bio/
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /link-in-bio/index.html [L]
</IfModule>
`;
  fs.writeFileSync(path.join(distDir, '.htaccess'), htaccessContent);
  console.log('Skapade .htaccess');
  
  console.log('Byggprocess för version utan ES-moduler slutförd!');
  console.log('För att deploya, använd: npm run deploy:nomodule');
  
} catch (error) {
  console.error('Ett fel inträffade under bygget:', error);
  process.exit(1);
}
