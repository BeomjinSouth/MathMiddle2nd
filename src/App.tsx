/**
 * Main Application Component
 * 
 * This is the root component of the Math Middle School 2nd Grade geometry application.
 * It provides routing functionality to navigate between different lesson modules:
 * - Home page: Module selection interface
 * - Isosceles Lab: Interactive isosceles triangle proof environment
 * - RHA/RHS Lab: Right triangle congruence proof environment
 * 
 * The application uses React Router for client-side routing and implements
 * lazy loading for the RHA/RHS lab to optimize initial bundle size.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import IsoscelesLab from './pages/IsoscelesLab';
import { lazy, Suspense } from 'react';

/**
 * Lazy-loaded RHA/RHS Lab component
 * 
 * This component is loaded on-demand to reduce the initial bundle size.
 * It contains the complex right triangle congruence proof interface.
 */
const RHARHSLab = lazy(() => import('./pages/RhaRhsLab'));

/**
 * Root application component with routing configuration
 * 
 * Sets up the main application structure with React Router for navigation
 * between different geometry lesson modules. Includes loading states for
 * lazy-loaded components.
 * 
 * @returns The complete application with routing and suspense boundaries
 */
function App() {
  return (
    <Router>
      {/* Suspense boundary for lazy-loaded components with Korean loading message */}
      <Suspense fallback={<div className="p-6">로딩 중…</div>}>
        <Routes>
          {/* Home page - module selection interface */}
          <Route path="/" element={<Home />} />
          
          {/* Isosceles triangle proof lab */}
          <Route path="/isosceles" element={<IsoscelesLab />} />
          
          {/* Right triangle congruence (RHA/RHS) proof lab */}
          <Route path="/rha-rhs" element={<RHARHSLab />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;