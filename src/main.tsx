import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/main.scss'

// Logga för felsökning
console.log('React app mounting...');
console.log('Window location:', window.location.href);

// Säkerställ att root-elementet finns
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  console.log('Created new root element');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
