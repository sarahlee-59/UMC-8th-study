import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

if (import.meta.env.DEV) {
  import('@welldone-software/why-did-you-render').then((whyDidYouRenderModule) => {
    whyDidYouRenderModule.default(React, {
      trackAllPureComponents: true,
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>
);
