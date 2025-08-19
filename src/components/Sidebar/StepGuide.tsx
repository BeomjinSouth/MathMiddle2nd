import type { Step } from '../../config/steps/isoscelesSteps';

interface StepGuideProps {
  step?: Step;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const StepGuide = ({ step, onPrev, onNext, canGoPrev, canGoNext }: StepGuideProps) => {
  if (!step) return null;

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
            {step.criteria.map((criteria, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded flex items-center justify-center">
                  {/* TODO: 실제 검증 상태에 따라 체크마크 표시 */}
                </div>
                <span className="text-sm text-gray-600">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-4">
          단계 검증하기
        </button>
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
