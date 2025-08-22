import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLessonStore } from '../state/lessonStore';
import { getStepsByMode, getStepById } from '../config/steps/rhaRhsSteps';
import GeometryBoard from '../components/Board/GeometryBoard';
import RhaRhsStepGuide from '../components/Sidebar/RhaRhsStepGuide';
import RhaRhsToolbox from '../components/Toolbar/RhaRhsToolbox';

const RhaRhsLab = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState<'RHA' | 'RHS' | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Zustand store
  const setMode = useLessonStore((s) => s.setMode);
  const resetLocks = useLessonStore((s) => s.resetLocks);

  // 모드 선택 후 첫 번째 단계로 초기화
  const handleModeSelect = (mode: 'RHA' | 'RHS') => {
    console.log('🔍 RHA/RHS 모드 선택됨:', mode);
    setSelectedMode(mode);
    setMode(mode);
    const stepId = mode === 'RHA' ? 'rha-1' : 'rhs-1';
    setCurrentStepId(stepId);
    console.log('🔍 현재 단계 설정됨:', stepId);
    resetLocks();
  };

  // 단계별 처리
  const steps = selectedMode ? getStepsByMode(selectedMode) : [];
  const currentStep = getStepById(currentStepId);
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(steps[currentStepIndex - 1].id);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepId(steps[currentStepIndex + 1].id);
    }
  };

  const handleBackToSelection = () => {
    setSelectedMode(null);
    setCurrentStepId('');
    resetLocks();
  };

  return (
    <>
      {!selectedMode ? (
        // 모드 선택 화면
        <div className="h-screen flex flex-col bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">직각삼각형 합동 학습</h1>
            <Link className="text-blue-600 hover:underline" to="/">홈으로</Link>
          </header>
          
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">합동 조건을 선택하세요</h2>
                <p className="text-gray-600">직각삼각형의 합동 조건인 RHA 또는 RHS를 학습할 수 있습니다.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleModeSelect('RHA')}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold text-xl">∠</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">RHA 합동</h3>
                      <p className="text-sm text-gray-500">Right-Hypotenuse-Angle</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <strong>직각 + 빗변 + 예각</strong><br/>
                    직각과 빗변의 길이, 그리고 한 예각이 같으면 두 직각삼각형은 합동입니다.
                  </p>
                  <div className="text-blue-600 group-hover:text-blue-700 font-medium">
                    RHA 학습 시작하기 →
                  </div>
                </button>

                <button
                  onClick={() => handleModeSelect('RHS')}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-left group"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-green-600 font-bold text-xl">━</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">RHS 합동</h3>
                      <p className="text-sm text-gray-500">Right-Hypotenuse-Side</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    <strong>직각 + 빗변 + 직각변</strong><br/>
                    직각과 빗변의 길이, 그리고 한 직각변의 길이가 같으면 두 직각삼각형은 합동입니다.
                  </p>
                  <div className="text-green-600 group-hover:text-green-700 font-medium">
                    RHS 학습 시작하기 →
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 단계별 학습 화면
        <div className="h-screen flex flex-col bg-gray-50">
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
              <h1 className="text-lg font-semibold text-gray-900">
                {selectedMode} 합동 - {currentStep?.title || ''}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                단계 {currentStepIndex + 1} / {steps.length}
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
              <button
                onClick={handleBackToSelection}
                className="text-blue-600 hover:underline"
              >
                모드 변경
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
              <RhaRhsStepGuide 
                step={currentStep}
                onPrev={handlePrevStep}
                onNext={handleNextStep}
                canGoPrev={currentStepIndex > 0}
                canGoNext={currentStepIndex < steps.length - 1}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="bg-white border-b border-gray-200 p-2">
                <RhaRhsToolbox currentStep={currentStep} />
              </div>

              {/* Geometry Board */}
              <div className="flex-1 relative" style={{ minHeight: '560px' }}>
                <GeometryBoard />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RhaRhsLab;


