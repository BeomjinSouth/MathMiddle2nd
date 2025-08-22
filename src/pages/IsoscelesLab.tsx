/**
 * Isosceles Triangle Laboratory Component
 * 
 * This is the main laboratory environment for learning and proving properties
 * of isosceles triangles. It provides an interactive workspace where students
 * can construct geometric objects, follow guided proof steps, and validate
 * their constructions in real-time.
 * 
 * Key Features:
 * - Interactive JSXGraph-based geometry board
 * - Step-by-step proof guidance with hints and validation
 * - Comprehensive toolbox for geometric constructions
 * - Real-time validation of geometric relationships
 * - Responsive layout with collapsible sidebar
 * - Progress tracking through multiple proof steps
 * 
 * Learning Objectives:
 * - Understand isosceles triangle properties
 * - Learn to construct angle bisectors
 * - Apply SAS congruence conditions
 * - Prove that base angles of isosceles triangles are equal
 * - Explore perpendicular bisector properties
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLessonStore } from '../state/lessonStore';
import { isoscelesSteps } from '../config/steps/isoscelesSteps';
import GeometryBoard from '../components/Board/GeometryBoard';
import StepGuide from '../components/Sidebar/StepGuide';
import Toolbox from '../components/Toolbar/Toolbox';

/**
 * Main isosceles triangle laboratory component
 * 
 * Orchestrates the complete learning environment by combining the geometry board,
 * step guide, and toolbox components. Manages step navigation and validation state.
 * 
 * @returns JSX element containing the complete isosceles triangle learning interface
 */
const IsoscelesLab = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useLessonStore();
  const checks = useLessonStore((s) => s.checks);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentStepData = isoscelesSteps.find(step => step.id === currentStep);
  const currentStepIndex = isoscelesSteps.findIndex(step => step.id === currentStep);
  const setMode = useLessonStore((s) => s.setMode);
  const setCurrentStepSafe = (id: any) => {
    setMode('ISOSCELES');
    setCurrentStep(id);
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepSafe(isoscelesSteps[currentStepIndex - 1].id as any);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < isoscelesSteps.length - 1) {
      setCurrentStepSafe(isoscelesSteps[currentStepIndex + 1].id as any);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md hover:bg-gray-100"
            title="뒤로가기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">이등변삼각형의 성질</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            단계 {currentStepIndex + 1} / {isoscelesSteps.length}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2" title={JSON.stringify(checks[currentStep] || {})}>
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / isoscelesSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <StepGuide 
            step={currentStepData} 
            onPrev={handlePrevStep}
            onNext={handleNextStep}
            canGoPrev={currentStepIndex > 0}
            canGoNext={currentStepIndex < isoscelesSteps.length - 1}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-2">
            <Toolbox />
          </div>

          {/* Geometry Board */}
          <div className="flex-1 relative" style={{ minHeight: '560px' }}>
            <GeometryBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsoscelesLab;
