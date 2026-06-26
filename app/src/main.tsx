import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Code-split the buy page so the homepage bundle stays light (the cart,
// gallery and PDP-only code load only when /buy is visited).
const Buy = React.lazy(() => import('./pages/Buy'));

// On GitHub Pages the SPA is served from /<repo-name>/, so the router needs
// a matching basename. Vite exposes `import.meta.env.BASE_URL` which mirrors
// the `base` config (with a trailing slash) — strip the trailing slash for
// React Router.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <React.Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<Buy />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
