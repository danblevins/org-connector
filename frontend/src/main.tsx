import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const THEME_KEY = 'org-connector-theme';
const stored = localStorage.getItem(THEME_KEY);
const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = stored === 'dark' || stored === 'light' ? stored : prefersDark ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
