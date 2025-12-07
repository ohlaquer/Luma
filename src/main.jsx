import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/main.css';
import './assets/styles/scrollbar.css';

// import './test/TestTheme.css';
import { ThemeProvider } from './components/ThemeProvider.jsx';

// Тема ДО рендеру
const savedTheme =
  localStorage.getItem('theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.classList.toggle('dark', savedTheme === 'dark');

// ❗ ВАЖЛИВО: блокуємо transition на момент перемикання теми
document.body.classList.add('disable-transitions');
setTimeout(() => {
  document.body.classList.remove('disable-transitions');
}, 50);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
