/**
 * Application Entry Point
 * 
 * This is the main entry point for the React application. It initializes
 * the React root and renders the main App component within StrictMode.
 * 
 * StrictMode is enabled to help identify potential problems in the application
 * during development, including:
 * - Identifying unsafe lifecycles
 * - Warning about legacy string ref API usage
 * - Warning about deprecated findDOMNode usage
 * - Detecting unexpected side effects
 * - Detecting legacy context API
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Create React root and render the application
// The non-null assertion (!) is safe here as the 'root' element is guaranteed to exist in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
