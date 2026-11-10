/**
 * React Application Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { initializeAmplify } from './config/amplifyConfig';
import App from './app/App';
import '@styles/index.css';

// Initialize Amplify once at startup before rendering the app
initializeAmplify();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);