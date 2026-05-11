import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

/**
 * AI Audience Builder - Frontend Entry Point
 *
 * This file orchestrates the mounting of the React application into the DOM.
 * It establishes the root rendering context and enables StrictMode for
 * enhanced development-time verification of side-effects and performance.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find root element. Ensure index.html is correctly configured.',
  );
}

// 1. Create the React Root
const root = createRoot(rootElement);

// 2. Render the Application
root.render(
  <StrictMode>
    {/* Main Application Container */}
    <App />
  </StrictMode>,
);
