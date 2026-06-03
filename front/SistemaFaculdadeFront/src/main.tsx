import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Injeta as fontes do Google (Syne + DM Sans) no <head> dinamicamente
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);