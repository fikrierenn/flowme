import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// PWA için service worker'ı aktif et
serviceWorkerRegistration.register();
