import type { RhaRhsStep } from '../../config/steps/rhaRhsSteps';
import { useLessonStore } from '../../state/lessonStore';

interface RhaRhsToolboxProps {
  currentStep?: RhaRhsStep;
}

const RhaRhsToolbox = ({ currentStep }: RhaRhsToolboxProps) => {
  const pins = useLessonStore((s) => s.pins);
  const setPin = useLessonStore((s) => s.setPin);
  const mirrorAllowed = useLessonStore((s) => s.mirrorAllowed);
  const setMirrorAllowed = useLessonStore((s) => s.setMirrorAllowed);
  const board = useLessonStore((s) => s.board);

  if (!currentStep) return null;

  // 겹쳐보기 토글
  const toggleOverlay = () => {
    const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      const scratch = (calculator as any).scratch;
      const active = !(scratch?.overlayActive || false);
      scratch.overlayActive = active;
      
      // Find overlay expressions and toggle their opacity
      const expressions = calculator.getExpressions();
      expressions.forEach(expr => {
        if (expr.id && expr.id.includes('overlay')) {
          const opacity = active ? (scratch?.overlayOpacity || 0.4) : 1;
          calculator.setExpression({
            id: expr.id,
            ...expr,
            hidden: !active
          });
        }
      });
    } catch (err) {
      console.warn('[RhaRhsToolbox] toggleOverlay failed:', err);
    }
  };

  // 측정값 표시 토글
  const toggleMeasurements = () => {
    const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      const scratch = (calculator as any).scratch;
      const visible = !(scratch?.measurementsVisible ?? true);
      scratch.measurementsVisible = visible;
      
      // Find measurement expressions and toggle visibility
      const expressions = calculator.getExpressions();
      expressions.forEach(expr => {
        if (expr.id && (expr.id.includes('measure') || expr.id.includes('tool-angle') || expr.id.includes('tool-measure'))) {
          calculator.setExpression({
            id: expr.id,
            ...expr,
            hidden: !visible
          });
        }
      });
    } catch (err) {
      console.warn('[RhaRhsToolbox] toggleMeasurements failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽: 현재 단계 정보 */}
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-gray-500">현재:</span>
          <span className="font-medium text-gray-900 ml-1">
            {currentStep.title.replace(/^(RHA|RHS) \d+단계: /, '')}
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          currentStep.mode === 'RHA' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {currentStep.mode}
        </div>
      </div>

      {/* 오른쪽: 도구 */}
      <div className="flex items-center space-x-2">
        {/* 4단계(합동 확인)에서만 표시 */}
        {currentStep.id.includes('4') && (
          <>
            {/* 겹쳐보기 */}
            <button
              onClick={toggleOverlay}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              title="복제된 삼각형 겹쳐보기"
            >
              <span>👁️</span>
              <span>겹쳐보기</span>
            </button>

            {/* 투명도 */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">투명도</span>
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={40}
                onChange={(e) => {
                  const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
                  if (!calculator) return;
                  
                  const opacity = Number(e.target.value) / 100;
                  const scratch = (calculator as any).scratch;
                  if (scratch) {
                    scratch.overlayOpacity = opacity;
                    
                    // Update overlay expressions with new opacity
                    const expressions = calculator.getExpressions();
                    expressions.forEach(expr => {
                      if (expr.id && expr.id.includes('overlay')) {
                        calculator.setExpression({
                          id: expr.id,
                          ...expr,
                          lineOpacity: opacity
                        });
                      }
                    });
                  }
                }}
              />
            </div>

            {/* 거울상 허용 */}
            <label className="flex items-center space-x-1 px-2 py-1 text-sm">
              <input
                type="checkbox"
                checked={mirrorAllowed}
                onChange={(e) => setMirrorAllowed(e.target.checked)}
                className="rounded"
              />
              <span className="text-gray-700">거울상 허용</span>
            </label>

            {/* 핀 고정 설정 */}
            <div className="flex items-center space-x-1 text-xs">
              <span className="text-gray-500">핀 고정:</span>
              <select 
                className="border rounded px-1 py-0.5 text-xs" 
                value={pins.A ?? ''} 
                onChange={(e) => setPin('A', (e.target.value || null) as any)}
              >
                <option value="">A→?</option>
                <option value="A2">A′</option>
                <option value="B2">B′</option>
                <option value="C2">C′</option>
              </select>
              <select 
                className="border rounded px-1 py-0.5 text-xs" 
                value={pins.B ?? ''} 
                onChange={(e) => setPin('B', (e.target.value || null) as any)}
              >
                <option value="">B→?</option>
                <option value="A2">A′</option>
                <option value="B2">B′</option>
                <option value="C2">C′</option>
              </select>
              <select 
                className="border rounded px-1 py-0.5 text-xs" 
                value={pins.C ?? ''} 
                onChange={(e) => setPin('C', (e.target.value || null) as any)}
              >
                <option value="">C→?</option>
                <option value="A2">A′</option>
                <option value="B2">B′</option>
                <option value="C2">C′</option>
              </select>
            </div>
          </>
        )}

        {/* 측정값 표시 */}
        <button
          onClick={toggleMeasurements}
          className="flex items-center space-x-1 px-2 py-1 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded"
          title="길이와 각도 측정값 표시"
        >
          <span>📏</span>
          <span className="hidden sm:inline">측정값</span>
        </button>

        {/* 화면 초기화 */}
        <button
          onClick={() => {
            const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
            if (!calculator) return;
            
            try {
              // Reset the viewport to default bounds
              calculator.setMathBounds({
                left: -8,
                right: 8,
                bottom: -6,
                top: 6
              });
            } catch (err) {
              console.warn('[RhaRhsToolbox] viewport reset failed:', err);
            }
          }}
          className="flex items-center space-x-1 px-2 py-1 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded"
          title="화면 맞춤"
        >
          <span>🔄</span>
          <span className="hidden sm:inline">화면맞춤</span>
        </button>

        {/* 모든 설정 초기화 */}
        <button
          onClick={() => {
            const s = useLessonStore.getState();
            s.resetLocks();
            s.clearCreated();
          }}
          className="flex items-center space-x-1 px-2 py-1 text-sm bg-white border border-gray-300 hover:bg-gray-50 rounded"
          title="모든 설정 초기화"
        >
          <span>🧹</span>
          <span className="hidden sm:inline">초기화</span>
        </button>

        {/* 도움말 */}
        <button
          onClick={() => alert(currentStep.description + '\n\n' + currentStep.instructions.join('\n'))}
          className="flex items-center space-x-1 px-2 py-1 text-sm bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded"
          title="현재 단계 도움말"
        >
          <span>❓</span>
          <span className="hidden sm:inline">도움말</span>
        </button>
      </div>
    </div>
  );
};

export default RhaRhsToolbox;