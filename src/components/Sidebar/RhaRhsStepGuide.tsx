import type { RhaRhsStep } from '../../config/steps/rhaRhsSteps';
import { useLessonStore } from '../../state/lessonStore';
import { getTrianglePoints } from '../../utils/geometry/desmosParse';

// Helper functions for Desmos API integration

const repositionForRightTriangle = (calculator: Desmos.Calculator, rightVertex: string) => {
  // Reposition triangle points to form a right triangle
  if (rightVertex === 'C') {
    calculator.setExpression({ id: 'point-A', latex: 'A=(0,3)' });
    calculator.setExpression({ id: 'point-B', latex: 'B=(4,0)' });
    calculator.setExpression({ id: 'point-C', latex: 'C=(0,0)' });
  } else if (rightVertex === 'A') {
    calculator.setExpression({ id: 'point-A', latex: 'A=(0,0)' });
    calculator.setExpression({ id: 'point-B', latex: 'B=(4,0)' });
    calculator.setExpression({ id: 'point-C', latex: 'C=(0,3)' });
  } else { // rightVertex === 'B'
    calculator.setExpression({ id: 'point-A', latex: 'A=(0,3)' });
    calculator.setExpression({ id: 'point-B', latex: 'B=(0,0)' });
    calculator.setExpression({ id: 'point-C', latex: 'C=(4,0)' });
  }
};

const addRightAngleMarker = (calculator: Desmos.Calculator, rightVertex: string) => {
  // Add a visual marker for the right angle
  const markerId = 'right-angle-marker';
  
  // Remove existing marker
  calculator.removeExpression({ id: markerId });
  
  // Add new marker based on right vertex
  if (rightVertex === 'C') {
    calculator.setExpression({
      id: markerId,
      latex: '\\left[\\left(0,0.3\\right),\\left(0.3,0.3\\right),\\left(0.3,0\\right)\\right]',
      color: '#dc2626',
      lineWidth: 2
    });
  }
  // Add similar markers for other vertices as needed
};

const applyConstraints = (calculator: Desmos.Calculator) => {
  // Apply current constraints from the lesson store
  const state = useLessonStore.getState();
  
  if (state.hypotenuseLen && state.rightAt) {
    // Apply hypotenuse length constraint
    const hypLen = state.hypotenuseLen / 50; // Convert pixels to graph units roughly (temporary ratio)
    
    // Clear previous constraint
    try { calculator.removeExpression({ id: 'constraint-hypotenuse' }); } catch {}

    // Determine hypotenuse by right vertex
    const hypExpr = state.rightAt === 'A'
      ? `\\sqrt{\\left(B.x-C.x\\right)^2+\\left(B.y-C.y\\right)^2}` // BC
      : state.rightAt === 'B'
      ? `\\sqrt{\\left(A.x-C.x\\right)^2+\\left(A.y-C.y\\right)^2}` // AC
      : `\\sqrt{\\left(A.x-B.x\\right)^2+\\left(A.y-B.y\\right)^2}`; // AB (right at C)

    calculator.setExpression({
      id: 'constraint-hypotenuse',
      latex: `${hypExpr}=${hypLen.toFixed(2)}`
    });
  }
  
  if (state.angleLock && state.rightAt) {
    // Apply angle constraint
    const angle = state.angleLock.deg;
    // Clear previous
    try { calculator.removeExpression({ id: 'constraint-angle' }); } catch {}
    // Constrain acute angle at the appropriate vertex (example when rightAt=C -> lock A)
    const at = state.angleLock.at;
    // Use vector dot product formula to constrain angle value
    const angleExpr = at === 'A'
      ? `\\arccos\\left(\\frac{(B.x-A.x)(C.x-A.x)+(B.y-A.y)(C.y-A.y)}{\\sqrt{(B.x-A.x)^2+(B.y-A.y)^2} \\cdot \\sqrt{(C.x-A.x)^2+(C.y-A.y)^2}}\\right) * \\frac{180}{\\pi}`
      : at === 'B'
      ? `\\arccos\\left(\\frac{(A.x-B.x)(C.x-B.x)+(A.y-B.y)(C.y-B.y)}{\\sqrt{(A.x-B.x)^2+(A.y-B.y)^2} \\cdot \\sqrt{(C.x-B.x)^2+(C.y-B.y)^2}}\\right) * \\frac{180}{\\pi}`
      : `\\arccos\\left(\\frac{(A.x-C.x)(B.x-C.x)+(A.y-C.y)(B.y-C.y)}{\\sqrt{(A.x-C.x)^2+(A.y-C.y)^2} \\cdot \\sqrt{(B.x-C.x)^2+(B.y-C.x)^2}}\\right) * \\frac{180}{\\pi}`;

    calculator.setExpression({
      id: 'constraint-angle',
      latex: `${angleExpr}=${angle}`
    });
  }
  
  if (state.sideLock && state.rightAt) {
    // Apply side length constraint
    const sideLen = state.sideLock.len / 50; // Convert pixels to graph units
    // Clear previous
    try { calculator.removeExpression({ id: 'constraint-leg' }); } catch {}
    const name = state.sideLock.name;
    const sideExpr = name === 'AB'
      ? `\\sqrt{\\left(A.x-B.x\\right)^2+\\left(A.y-B.y\\right)^2}`
      : name === 'AC'
      ? `\\sqrt{\\left(A.x-C.x\\right)^2+\\left(A.y-C.y\\right)^2}`
      : `\\sqrt{\\left(B.x-C.x\\right)^2+\\left(B.y-C.y\\right)^2}`;

    calculator.setExpression({
      id: 'constraint-leg',
      latex: `${sideExpr}=${sideLen.toFixed(2)}`
    });
  }
};

interface RhaRhsStepGuideProps {
  step?: RhaRhsStep;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

const RhaRhsStepGuide = ({ step, onPrev, onNext, canGoPrev, canGoNext }: RhaRhsStepGuideProps) => {
  const rightAt = useLessonStore((s) => s.rightAt);
  const setRightAt = useLessonStore((s) => s.setRightAt);
  const hypotenuseLen = useLessonStore((s) => s.hypotenuseLen);
  const setHypotenuseLen = useLessonStore((s) => s.setHypotenuseLen);
  const angleLock = useLessonStore((s) => s.angleLock);
  const setAngleLock = useLessonStore((s) => s.setAngleLock);
  const sideLock = useLessonStore((s) => s.sideLock);
  const setSideLock = useLessonStore((s) => s.setSideLock);
  const resetLocks = useLessonStore((s) => s.resetLocks);
  const congruent = useLessonStore((s) => s.congruent);
  const setCongruent = useLessonStore((s) => s.setCongruent);

  if (!step) return null;

  // 현재 단계별 잠금 상태 확인
  const isRightAngleSet = Boolean(rightAt);
  const isHypotenuseSet = Boolean(hypotenuseLen);
  const isAngleSet = Boolean(angleLock);
  const isSideSet = Boolean(sideLock);

  // 단계 완료 체크
  const getStepStatus = () => {
    switch (step.id) {
      case 'rha-1':
      case 'rhs-1':
        return isRightAngleSet;
      case 'rha-2':
      case 'rhs-2':
        return isRightAngleSet && isHypotenuseSet;
      case 'rha-3':
        return isRightAngleSet && isHypotenuseSet && isAngleSet;
      case 'rhs-3':
        return isRightAngleSet && isHypotenuseSet && isSideSet;
      case 'rha-4':
      case 'rhs-4':
        return congruent;
      default:
        return false;
    }
  };

  const stepCompleted = getStepStatus();

  // 자유도 계산
  const calculateDOF = () => {
    let dof = 2; // 기본 자유도
    if (isRightAngleSet) dof = 2;
    if (isRightAngleSet && isHypotenuseSet) dof = 1;
    if (step.mode === 'RHA' && isRightAngleSet && isHypotenuseSet && isAngleSet) dof = 0;
    if (step.mode === 'RHS' && isRightAngleSet && isHypotenuseSet && isSideSet) dof = 0;
    return dof;
  };

  const dof = calculateDOF();

  // 보드에 변경사항 적용
  const applyToBoard = () => {
    const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      if (step.id.includes('1')) {
        // Initialize right triangle
        const vertex = rightAt || 'C';
        repositionForRightTriangle(calculator, vertex);
        addRightAngleMarker(calculator, vertex);
      } else {
        // Apply constraints for steps 2 and 3
        applyConstraints(calculator);
      }
    } catch (err) {
      console.warn('[RhaRhsStepGuide] applyToBoard failed:', err);
    }
  };

  // 삼각형 복제
  const cloneTriangle = () => {
    const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      // Clone the current triangle with an offset
      const points = getTrianglePoints(calculator);
      if (!points) return;
      
      const offset = { x: 2, y: 1 };
      const cloneId = Date.now();
      
      // Create cloned triangle points
      calculator.setExpression({
        id: `clone-A-${cloneId}`,
        latex: `A'=(${(points.A.x + offset.x).toFixed(2)}, ${(points.A.y + offset.y).toFixed(2)})`,
        color: '#0ea5e9',
        pointSize: 6,
        showLabel: true,
        label: "A'"
      });
      
      calculator.setExpression({
        id: `clone-B-${cloneId}`,
        latex: `B'=(${(points.B.x + offset.x).toFixed(2)}, ${(points.B.y + offset.y).toFixed(2)})`,
        color: '#0ea5e9',
        pointSize: 6,
        showLabel: true,
        label: "B'"
      });
      
      calculator.setExpression({
        id: `clone-C-${cloneId}`,
        latex: `C'=(${(points.C.x + offset.x).toFixed(2)}, ${(points.C.y + offset.y).toFixed(2)})`,
        color: '#0ea5e9',
        pointSize: 6,
        showLabel: true,
        label: "C'"
      });
      
      // Create cloned triangle sides
      calculator.setExpression({
        id: `clone-side-AB-${cloneId}`,
        latex: `\\left[A', B'\\right]`,
        color: '#0ea5e9',
        lineWidth: 2
      });
      
      calculator.setExpression({
        id: `clone-side-BC-${cloneId}`,
        latex: `\\left[B', C'\\right]`,
        color: '#0ea5e9',
        lineWidth: 2
      });
      
      calculator.setExpression({
        id: `clone-side-CA-${cloneId}`,
        latex: `\\left[C', A'\\right]`,
        color: '#0ea5e9',
        lineWidth: 2
      });
      
    } catch (err) {
      console.warn('[RhaRhsStepGuide] cloneTriangle failed:', err);
    }
  };

  // 합동 검사
  const checkCongruence = () => {
    const calculator = useLessonStore.getState().board as Desmos.Calculator | null;
    if (!calculator) return;
    
    try {
      // Simple congruence check based on conditions
      const isRightAngleSet = Boolean(rightAt);
      const isHypotenuseSet = Boolean(hypotenuseLen);
      const isAngleSet = Boolean(angleLock);
      const isSideSet = Boolean(sideLock);
      
      let conditionsMet = false;
      if (step.mode === 'RHA') {
        conditionsMet = isRightAngleSet && isHypotenuseSet && isAngleSet;
      } else if (step.mode === 'RHS') {
        conditionsMet = isRightAngleSet && isHypotenuseSet && isSideSet;
      }
      
      setCongruent(conditionsMet);
      
      if (conditionsMet) {
        // Show success message or animation
        console.log('[RhaRhsStepGuide] Congruence confirmed!');
      }
    } catch (err) {
      console.warn('[RhaRhsStepGuide] checkCongruence failed:', err);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h2>
          <div className="text-sm text-gray-500 mb-2">
            모드: <span className="font-semibold text-blue-600">{step.mode}</span>
          </div>
          {stepCompleted && (
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ 완료
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">목표</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{step.goal}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">설명</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">진행 순서</h3>
          <ul className="space-y-2">
            {step.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-600">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 단계별 컨트롤 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">현재 단계 설정</h3>
          
          {step.id.includes('1') && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">직각 꼭짓점 선택</label>
                <select
                  value={rightAt || ''}
                  onChange={(e) => setRightAt((e.target.value || null) as any)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">선택하세요</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
              {rightAt && (
                <button
                  onClick={() => {
                    console.log('🔍 직각삼각형으로 변경 버튼 클릭됨!');
                    applyToBoard();
                  }}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                >
                  직각삼각형으로 변경
                </button>
              )}
            </div>
          )}

          {step.id.includes('2') && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">빗변 길이 (픽셀)</label>
                <input
                  type="number"
                  value={hypotenuseLen || ''}
                  onChange={(e) => setHypotenuseLen(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="예: 100"
                  min="50"
                  max="200"
                />
              </div>
              {hypotenuseLen && (
                <button
                  onClick={applyToBoard}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700"
                >
                  빗변 길이 적용
                </button>
              )}
            </div>
          )}

          {step.id === 'rha-3' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">예각 크기 (도)</label>
                <input
                  type="number"
                  value={angleLock?.deg || ''}
                  onChange={(e) => setAngleLock(e.target.value ? { 
                    at: rightAt === 'C' ? 'A' : rightAt === 'A' ? 'B' : 'A', 
                    deg: Number(e.target.value) 
                  } : null)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="예: 30"
                  min="5"
                  max="85"
                />
              </div>
              {angleLock && (
                <button
                  onClick={applyToBoard}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700"
                >
                  예각 적용
                </button>
              )}
            </div>
          )}

          {step.id === 'rhs-3' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">직각변 선택</label>
                <select
                  value={sideLock?.name || ''}
                  onChange={(e) => setSideLock(e.target.value ? { 
                    name: e.target.value as any, 
                    len: sideLock?.len || 60 
                  } : null)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="">선택하세요</option>
                  {rightAt === 'C' && (
                    <>
                      <option value="CA">CA (직각변1)</option>
                      <option value="CB">CB (직각변2)</option>
                    </>
                  )}
                  {rightAt === 'A' && (
                    <>
                      <option value="AB">AB (직각변1)</option>
                      <option value="AC">AC (직각변2)</option>
                    </>
                  )}
                  {rightAt === 'B' && (
                    <>
                      <option value="BA">BA (직각변1)</option>
                      <option value="BC">BC (직각변2)</option>
                    </>
                  )}
                </select>
              </div>
              {sideLock && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">직각변 길이 (픽셀)</label>
                  <input
                    type="number"
                    value={sideLock?.len || ''}
                    onChange={(e) => setSideLock(sideLock ? { 
                      ...sideLock, 
                      len: Number(e.target.value) 
                    } : null)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="예: 60"
                    min="30"
                    max="150"
                  />
                </div>
              )}
              {sideLock && sideLock.len && (
                <button
                  onClick={applyToBoard}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded text-sm hover:bg-purple-700"
                >
                  직각변 적용
                </button>
              )}
            </div>
          )}

          {step.id.includes('4') && (
            <div className="space-y-2">
              <button
                onClick={cloneTriangle}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
              >
                삼각형 복제
              </button>
              <button
                onClick={checkCongruence}
                className="w-full bg-indigo-600 text-white py-2 px-3 rounded text-sm hover:bg-indigo-700"
              >
                합동 검사
              </button>
            </div>
          )}
        </div>

        {/* 자유도 표시 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700">자유도 (DoF)</h3>
            <span className="text-lg font-bold text-blue-600">{dof}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                dof === 0 ? 'bg-green-500' : dof === 1 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${((2 - dof) / 2) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {dof === 0 ? '삼각형이 유일하게 결정됨' : 
             dof === 1 ? '추가 조건 1개 필요' : 
             '추가 조건 2개 필요'}
          </p>
        </div>

        {/* 상태 표시 */}
        {stepCompleted && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">{step.successMessage}</p>
          </div>
        )}

        {/* 초기화 버튼 */}
        <button
          onClick={resetLocks}
          className="w-full text-sm text-gray-600 hover:text-gray-800 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          모든 설정 초기화
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

export default RhaRhsStepGuide;