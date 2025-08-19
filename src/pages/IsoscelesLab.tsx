import { useState } from 'react';
import { useLessonStore } from '../state/lessonStore';
import { isoscelesSteps } from '../config/steps/isoscelesSteps';
import GeometryBoard from '../components/Board/GeometryBoard';
import StepGuide from '../components/Sidebar/StepGuide';
import Toolbox from '../components/Toolbar/Toolbox';

const IsoscelesLab = () => {
  const { currentStep, setCurrentStep } = useLessonStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentStepData = isoscelesSteps.find(step => step.id === currentStep);
  const currentStepIndex = isoscelesSteps.findIndex(step => step.id === currentStep);

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(isoscelesSteps[currentStepIndex - 1].id as any);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < isoscelesSteps.length - 1) {
      setCurrentStep(isoscelesSteps[currentStepIndex + 1].id as any);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
          <div className="w-32 bg-gray-200 rounded-full h-2">
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
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 p-2">
            <Toolbox />
          </div>

          {/* Geometry Board */}
          <div className="flex-1 relative">
            <GeometryBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsoscelesLab;
