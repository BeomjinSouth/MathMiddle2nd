/**
 * Step Guide Sidebar Component
 * 
 * This component provides the step-by-step guidance interface for geometry proofs.
 * It displays the current proof step, objectives, hints, validation status, and
 * navigation controls. The component is used specifically for isosceles triangle
 * proof workflows.
 * 
 * Features:
 * - Current step title and objective display
 * - Expandable hints section for student guidance
 * - Real-time validation status indicators
 * - Step navigation controls (previous/next buttons)
 * - Tolerance adjustment controls for geometric validation
 * - Progress tracking with visual feedback
 */

import type { Step } from '../../config/steps/isoscelesSteps';
import { useLessonStore } from '../../state/lessonStore';

/**
 * Props interface for the StepGuide component
 */
interface StepGuideProps {
  /** Current step configuration object containing title, goal, hints, and criteria */
  step?: Step;
  
  /** Callback function to navigate to the previous step */
  onPrev: () => void;
  
  /** Callback function to navigate to the next step */
  onNext: () => void;
  
  /** Whether navigation to previous step is allowed */
  canGoPrev: boolean;
  
  /** Whether navigation to next step is allowed */
  canGoNext: boolean;
}

/**
 * Step guide component for isosceles triangle proof workflow
 * 
 * Renders a comprehensive sidebar interface that guides students through
 * the proof process with objectives, hints, validation feedback, and controls.
 * 
 * @param props - Component props containing step data and navigation callbacks
 * @returns JSX element containing the complete step guide interface
 */
const StepGuide = ({ step, onPrev, onNext, canGoPrev, canGoNext }: StepGuideProps) => {
  const runValidation = useLessonStore((s) => s.runValidation);
  const checks = useLessonStore((s) => s.checks);
  const currentStep = useLessonStore((s) => s.currentStep);
  const tolerance = useLessonStore((s) => s.tolerance);
  const setTolerance = useLessonStore((s) => s.setTolerance);

  if (!step) return null;

  const currentChecks = checks[currentStep] || {};

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">목표</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{step.goal}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">힌트</h3>
          <ul className="space-y-2">
            {step.hints.map((hint, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600">{hint}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">체크리스트</h3>
          <div className="space-y-2">
            {step.criteria.map((criteria, index) => {
              const passed = Boolean(currentChecks[criteria]);
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                    passed ? 'bg-green-500 text-white' : 'border-2 border-gray-300'
                  }`}>
                    {passed ? '✓' : ''}
                  </div>
                  <span className={`text-sm ${passed ? 'text-gray-800' : 'text-gray-600'}`}>{criteria}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">허용오차</h3>
          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <span className="text-gray-600">각(°)</span>
              <input
                type="number"
                className="w-16 border rounded px-2 py-1"
                value={tolerance.angle}
                min={0.1}
                step={0.1}
                onChange={(e) => setTolerance({ angle: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-gray-600">길이(px)</span>
              <input
                type="number"
                className="w-20 border rounded px-2 py-1"
                value={tolerance.lengthPx}
                min={0.1}
                step={0.1}
                onChange={(e) => setTolerance({ lengthPx: Number(e.target.value) })}
              />
            </label>
          </div>
        </div>

        <button
          onClick={runValidation}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-4 shadow"
        >
          단계 검증하기
        </button>
        {Object.keys(currentChecks).length > 0 && (
          <div className="text-xs text-gray-600">
            {Object.entries(currentChecks).map(([k, v]) => (
              <div key={k}>
                {k}: {v ? '통과' : '미통과'}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            canGoPrev
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            canGoNext
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default StepGuide;
