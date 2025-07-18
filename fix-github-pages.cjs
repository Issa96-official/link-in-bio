// Fix for GitHub Pages build error
// This script is run after the build but before the gh-pages deploy
const fs = require('fs');
const path = require('path');

console.log('Starting GitHub Pages preparation for JavaScript version...');

// Copy the index.html to the dist folder
const distPath = path.join(__dirname, 'dist');
const distIndexPath = path.join(distPath, 'index.html');
const rootIndexPath = path.join(__dirname, 'index.html');

// Check if the dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('Error: dist directory does not exist. Run build first.');
  process.exit(1);
}

// Copy root index.html to dist folder
if (fs.existsSync(rootIndexPath)) {
  let indexContent = fs.readFileSync(rootIndexPath, 'utf8');
  
  // Fix script reference to point to correct JavaScript file
  const files = fs.readdirSync(path.join(distPath, 'assets'));
  const indexJsFile = files.find(file => file.startsWith('index-') && file.endsWith('.js'));
  
  if (indexJsFile) {
    console.log(`Found main JS file: ${indexJsFile}`);
    // Update to use JavaScript instead of TypeScript
    indexContent = indexContent.replace(
      /<script.*src=".*main.jsx"><\/script>/,
      `<script type="module" src="./assets/${indexJsFile}"></script>`
    );
  } else {
    console.log('Could not find main JS file, using fallback pattern');
    indexContent = indexContent.replace(
      /<script.*src=".*main.jsx"><\/script>/,
      '<script type="module" src="./assets/index.js"></script>'
    );
  }
  
  // Add debugging info
  indexContent = indexContent.replace(
    '</head>',
    `<script>
      console.log('Built for GitHub Pages - JavaScript Version');
      console.log('Base URL:', window.location.href);
    </script>
</head>`
  );
  
  // Write the fixed index.html to dist folder
  fs.writeFileSync(distIndexPath, indexContent);
  console.log('Copied and updated index.html to dist folder');
} else {
  console.error('Error: No index.html found in root folder');
}

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

// Create a web.config file to set MIME types correctly
const webConfigContent = `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <remove fileExtension=".js" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <remove fileExtension=".mjs" />
      <mimeMap fileExtension=".mjs" mimeType="application/javascript" />
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".css" />
      <mimeMap fileExtension=".css" mimeType="text/css" />
    </staticContent>
    <rewrite>
      <rules>
        <rule name="ReactRouter Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/link-in-bio/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>`;

fs.writeFileSync(path.join(distPath, 'web.config'), webConfigContent);
console.log('Created web.config file for MIME types and routing');

// Create an .htaccess file for Apache servers
const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /link-in-bio/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /link-in-bio/index.html [L]
</IfModule>

# Set correct MIME types
AddType application/javascript .js
AddType application/javascript .mjs
AddType application/json .json
AddType text/css .css`;

fs.writeFileSync(path.join(distPath, '.htaccess'), htaccessContent);
console.log('Created .htaccess file for MIME types and routing');

// Create a simple direct loader page as backup
const directLoaderContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <title>Issa Alissa - Link in Bio</title>
  <meta name="description" content="Issa Alissa - All your important links in one place">
  <script>
    console.log('Direct loader running...');
  </script>
</head>
<body>
  <div id="root"></div>
  <p id="loadingMessage">Loading application...</p>
  
  <script>
    // Find the correct JS file to load
    fetch('./assets/')
      .then(response => response.text())
      .then(text => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const jsFile = links.find(link => link.textContent.includes('index-') && link.textContent.endsWith('.js'));
        
        if (jsFile) {
          console.log('Found JS file:', jsFile.textContent);
          const script = document.createElement('script');
          script.type = 'module';
          script.src = './assets/' + jsFile.textContent;
          document.body.appendChild(script);
        } else {
          document.getElementById('loadingMessage').textContent = 'Error: Could not find main JS file';
        }
      })
      .catch(error => {
        console.error('Error loading assets directory:', error);
        document.getElementById('loadingMessage').textContent = 'Error loading application';
      });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(distPath, 'direct-loader.html'), directLoaderContent);
console.log('Created direct-loader.html as backup');

console.log('GitHub Pages preparation completed successfully!');
