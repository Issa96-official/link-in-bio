// Debug helper for GitHub Pages deployment
console.log('Debug helper loaded successfully');

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Create debug panel
  const debugPanel = document.createElement('div');
  debugPanel.id = 'github-pages-debug-panel';
  debugPanel.style.position = 'fixed';
  debugPanel.style.bottom = '10px';
  debugPanel.style.right = '10px';
  debugPanel.style.padding = '10px';
  debugPanel.style.background = 'rgba(0,0,0,0.8)';
  debugPanel.style.color = 'white';
  debugPanel.style.borderRadius = '5px';
  debugPanel.style.zIndex = '9999';
  debugPanel.style.maxWidth = '400px';
  debugPanel.style.fontSize = '12px';
  debugPanel.style.maxHeight = '80vh';
  debugPanel.style.overflow = 'auto';
  debugPanel.style.fontFamily = 'monospace';
  debugPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

  // Build debug info
  let debugInfo = `
    <h4 style="margin-top:0">GitHub Pages Debug</h4>
    <p><strong>URL:</strong> ${window.location.href}</p>
    <p><strong>Path:</strong> ${window.location.pathname}</p>
    <p><strong>Host:</strong> ${window.location.host}</p>
    <p><strong>Base path:</strong> ${document.querySelector('base')?.getAttribute('href') || 'No base tag'}</p>
    <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
    <div id="debug-asset-tests"></div>
    <button id="testAssetPaths" style="padding:5px; margin:5px 0; cursor:pointer">Test Asset Paths</button>
    <button id="testScriptLoad" style="padding:5px; margin:5px 0; cursor:pointer">Test Script Loading</button>
    <button id="toggleDebug" style="padding:5px; margin:5px 0; cursor:pointer">Hide Debug</button>
    <div id="debug-log" style="margin-top:10px; border-top:1px solid #666; padding-top:10px;"></div>
  `;

  debugPanel.innerHTML = debugInfo;
  document.body.appendChild(debugPanel);
  
  // Add functionality to debug panel
  const debugLog = document.getElementById('debug-log');
  const logToPanel = (message, type = 'info') => {
    const color = type === 'error' ? 'red' : 
                 type === 'success' ? 'lightgreen' : 
                 type === 'warn' ? 'orange' : 'white';
    debugLog.innerHTML += `<p style="color:${color}; margin:3px 0">${message}</p>`;
    console.log(message);
  };
  
  // Attach event listeners
  document.getElementById('toggleDebug').addEventListener('click', () => {
    debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
  });
  
  // Test asset paths
  document.getElementById('testAssetPaths').addEventListener('click', async () => {
    const assetTests = document.getElementById('debug-asset-tests');
    assetTests.innerHTML = '<h4>Asset Path Tests:</h4>';
    
    logToPanel('Testing asset paths...', 'info');
    
    const pathsToTest = [
      './assets/',
      '/assets/',
      '/link-in-bio/assets/',
      './dist/assets/',
      '/link-in-bio/dist/assets/'
    ];
    
    for (const path of pathsToTest) {
      try {
        const startTime = performance.now();
        const response = await fetch(path);
        const endTime = performance.now();
        const status = response.status;
        
        if (status === 200) {
          logToPanel(`✅ Path ${path} - Success (${Math.round(endTime - startTime)}ms)`, 'success');
          assetTests.innerHTML += `<p style="color:lightgreen">✅ ${path} (${status})</p>`;
        } else {
          logToPanel(`❌ Path ${path} - Failed with status ${status}`, 'error');
          assetTests.innerHTML += `<p style="color:red">❌ ${path} (${status})</p>`;
        }
      } catch (e) {
        logToPanel(`❌ Path ${path} - Error: ${e.message}`, 'error');
        assetTests.innerHTML += `<p style="color:red">❌ ${path} (Error: ${e.message})</p>`;
      }
    }
  });
  
  // Test script loading
  document.getElementById('testScriptLoad').addEventListener('click', async () => {
    logToPanel('Testing script loading...', 'info');
    
    const scriptsToTest = [
      './assets/index.js',
      '/assets/index.js',
      '/link-in-bio/assets/index.js',
      './index.js'
    ];
    
    // Try to detect asset files in assets directory
    try {
      const response = await fetch('./assets/');
      if (response.ok) {
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        const jsFiles = links
          .map(link => link.href || link.textContent)
          .filter(href => String(href).endsWith('.js'));
        
        if (jsFiles.length > 0) {
          logToPanel(`Found JS files in assets directory: ${jsFiles.join(', ')}`, 'success');
          
          jsFiles.forEach(file => {
            const fileName = file.split('/').pop();
            if (!scriptsToTest.includes(`./assets/${fileName}`)) {
              scriptsToTest.push(`./assets/${fileName}`);
            }
          });
        } else {
          logToPanel('No JS files found in assets directory', 'warn');
        }
      }
    } catch (e) {
      logToPanel(`Could not list assets directory: ${e.message}`, 'error');
    }
    
    // Test each script
    for (const scriptPath of scriptsToTest) {
      try {
        const startTime = performance.now();
        const response = await fetch(scriptPath);
        const endTime = performance.now();
        const status = response.status;
        
        if (status === 200) {
          logToPanel(`✅ Script ${scriptPath} - Success (${Math.round(endTime - startTime)}ms)`, 'success');
          
          // Try to load as a module
          const scriptEl = document.createElement('script');
          scriptEl.type = 'module';
          scriptEl.src = scriptPath;
          
          const loadPromise = new Promise((resolve, reject) => {
            scriptEl.onload = () => resolve();
            scriptEl.onerror = (e) => reject(e);
            setTimeout(() => reject(new Error('Timeout')), 5000);
          });
          
          document.head.appendChild(scriptEl);
          
          try {
            await loadPromise;
            logToPanel(`✅ Module load: ${scriptPath} - Success`, 'success');
          } catch (e) {
            logToPanel(`❌ Module load: ${scriptPath} - Failed: ${e.message || 'Unknown error'}`, 'error');
          }
          
        } else {
          logToPanel(`❌ Script ${scriptPath} - Failed with status ${status}`, 'error');
        }
      } catch (e) {
        logToPanel(`❌ Script ${scriptPath} - Error: ${e.message}`, 'error');
      }
    }
  });
  
  // Capture console logs
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn
  };
  
  console.log = function(...args) {
    logToPanel(args.join(' '), 'info');
    originalConsole.log.apply(console, args);
  };
  
  console.error = function(...args) {
    logToPanel(args.join(' '), 'error');
    originalConsole.error.apply(console, args);
  };
  
  console.warn = function(...args) {
    logToPanel(args.join(' '), 'warn');
    originalConsole.warn.apply(console, args);
  };
  
  // Log initial info
  logToPanel('Debug helper initialized', 'info');
});
