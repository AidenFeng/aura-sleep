import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Buy from './pages/Buy';

// On GitHub Pages the SPA is served from /<repo-name>/, so the router needs
// a matching basename. Vite exposes `import.meta.env.BASE_URL` which mirrors
// the `base` config (with a trailing slash) — strip the trailing slash for
// React Router.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
