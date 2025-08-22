/**
 * Interactive Geometry Board Component
 * 
 * This component provides a modern, stable geometry visualization environment using
 * the Desmos Graphing Calculator API. It supports both isosceles triangle proofs 
 * and right triangle congruence (RHA/RHS) demonstrations.
 * 
 * Key Features:
 * - Modern mathematical visualization using Desmos API
 * - Interactive point manipulation with drag-and-drop
 * - Real-time geometric calculations and validation
 * - Support for constraint-based triangle construction
 * - Tool-based geometric constructions (points, lines, angles, etc.)
 */

import { useEffect, useRef, useState } from 'react';
import { useLessonStore } from '../../state/lessonStore';
import type { ToolId } from '../../state/lessonStore';
import { createDesmosIsoscelesValidator, createDesmosRightTriangleValidator } from '../../utils/geometry/desmosValidators';

type WinWithDesmosFlags = Window & {
  Desmos?: unknown;
  DESMOS_ERROR?: unknown;
  DESMOS_LOADED?: unknown;
};

type Scratch = {
  pendingPoints?: { x: number; y: number }[];
  created?: string[];
  overlayActive?: boolean;
  overlayOpacity?: number;
  measurementsVisible?: boolean;
};

/**
 * Information panel component for RHA/RHS triangle congruence modes
 */
const RhaRhsBoardInfo = () => {
  const mode = useLessonStore((s) => s.mode);
  const rightAt = useLessonStore((s) => s.rightAt);
  const hypotenuseLen = useLessonStore((s) => s.hypotenuseLen);
  const angleLock = useLessonStore((s) => s.angleLock);
  const sideLock = useLessonStore((s) => s.sideLock);
  
  if (mode === 'ISOSCELES') return null;

  const dof = (() => {
    let v = 2;
    if (rightAt) v = 2;
    if (rightAt && hypotenuseLen) v = 1;
    if (mode === 'RHA' && rightAt && hypotenuseLen && angleLock) v = 0;
    if (mode === 'RHS' && rightAt && hypotenuseLen && sideLock) v = 0;
    return v;
  })();

  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-3 shadow-md min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-gray-800">직각삼각형 ABC</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${mode === 'RHA' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{mode}</span>
      </div>
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex items-center justify-between"><span>직각 꼭짓점</span><span className={rightAt ? 'font-medium text-gray-800' : 'text-gray-400'}>{rightAt || '미설정'}</span></div>
        <div className="flex items-center justify-between"><span>빗변 길이</span><span className={hypotenuseLen ? 'font-medium text-gray-800' : 'text-gray-400'}>{hypotenuseLen ? `${hypotenuseLen}px` : '미설정'}</span></div>
        {mode === 'RHA' && (<div className="flex items-center justify-between"><span>예각</span><span className={angleLock ? 'font-medium text-gray-800' : 'text-gray-400'}>{angleLock ? `${angleLock.deg}°` : '미설정'}</span></div>)}
        {mode === 'RHS' && (<div className="flex items-center justify-between"><span>직각변</span><span className={sideLock ? 'font-medium text-gray-800' : 'text-gray-400'}>{sideLock ? `${sideLock.name}=${sideLock.len}px` : '미설정'}</span></div>)}
        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex items-center justify-between mb-1"><span>자유도</span><span className={`font-bold ${dof === 0 ? 'text-green-600' : dof === 1 ? 'text-yellow-600' : 'text-red-600'}`}>{dof}</span></div>
          <div className="w-full bg-gray-200 rounded-full h-1.5"><div className={`h-1.5 rounded-full ${dof === 0 ? 'bg-green-500' : dof === 1 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${((2 - dof) / 2) * 100}%` }} /></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main geometry board component
 */
const GeometryBoard = () => {
  // React Refs
  const boardRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<Desmos.Calculator | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Lesson Store State
  const setBoard = useLessonStore((s) => s.setBoard);
  const setValidator = useLessonStore((s) => s.setValidator);
  const selectedTool = useLessonStore((s) => s.selectedTool);
  const mode = useLessonStore((s) => s.mode);
  
  // Current triangle points
  const [trianglePoints, setTrianglePoints] = useState({
    A: mode === 'ISOSCELES' ? { x: 0, y: 4 } : { x: 0, y: 0 },
    B: mode === 'ISOSCELES' ? { x: -3, y: -2 } : { x: 4, y: 0 },
    C: mode === 'ISOSCELES' ? { x: 3, y: -2 } : { x: 0, y: 3 }
  });

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 50;
    
    const initializeDesmos = async () => {
      console.log('[DesmosBoard] initializeDesmos called, isMounted:', isMounted, 'boardRef:', !!boardRef.current);
      if (!isMounted || !boardRef.current) {
        console.log('[DesmosBoard] Skipping initialization - component not ready');
        // Retry if mounted but DOM not ready
        if (isMounted && retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeDesmos, 100);
        }
        return;
      }

      // Check for script loading error first
      const win = window as WinWithDesmosFlags;
      if (win.DESMOS_ERROR) {
        console.error('[DesmosBoard] Desmos script failed to load:', win.DESMOS_ERROR);
        setError('Desmos API 스크립트 로드에 실패했습니다. API 키를 확인해주세요.');
        setIsLoading(false);
        return;
      }

      // Check for Desmos with better detection  
      const DesmosAPI = win.Desmos as Record<string, unknown> | undefined;
      const maybeCtor = DesmosAPI?.GraphingCalculator as unknown;
      const hasGraphingCalculator = typeof maybeCtor === 'function';
      
      if (!hasGraphingCalculator) {
        console.log(`[DesmosBoard] Attempt ${retryCount + 1}/${maxRetries}: Waiting for Desmos GraphingCalculator...`);
        console.log('[DesmosBoard] Window object:', !!window);
        console.log('[DesmosBoard] Desmos object:', !!DesmosAPI);
        console.log('[DesmosBoard] GraphingCalculator function:', !!(DesmosAPI && DesmosAPI.GraphingCalculator));
        console.log('[DesmosBoard] DESMOS_LOADED flag:', !!win.DESMOS_LOADED);
        
        if (DesmosAPI) {
          console.log('[DesmosBoard] Available Desmos properties:', Object.keys(DesmosAPI));
        }
        
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeDesmos, 300);
          return;
        } else {
          console.error('[DesmosBoard] Desmos GraphingCalculator not available after max retries');
          setError(`Desmos GraphingCalculator를 찾을 수 없습니다. (${maxRetries}회 시도)`);
          setIsLoading(false);
          return;
        }
      }

      console.log('[DesmosBoard] Desmos API loaded successfully:', !!window.Desmos);

      try {
        // Clean up any existing calculator
        if (calculatorRef.current) {
          calculatorRef.current.destroy();
          calculatorRef.current = null;
        }

        // Create new Desmos calculator
        const GraphingCalculator = (DesmosAPI!.GraphingCalculator as (el: HTMLElement, opts?: Record<string, unknown>) => Desmos.Calculator);
        const calculator: Desmos.Calculator = GraphingCalculator(boardRef.current, {
          keypad: false,
          expressions: false,
          settingsMenu: false,
          zoomButtons: true,
          graphpaper: true,
          border: true,
          showGrid: true,
          showXAxis: true,
          showYAxis: true,
          xAxisNumbers: true,
          yAxisNumbers: true,
          language: 'ko'
        });

        if (!isMounted) {
          calculator.destroy();
          return;
        }

        calculatorRef.current = calculator;
        try { (window as unknown as { CALC?: unknown }).CALC = calculator; } catch {}
        try {
          const rect = boardRef.current.getBoundingClientRect();
          console.log('[DesmosBoard] container size:', rect.width, rect.height);
          calculator.resize();
          setTimeout(() => {
            try { calculator.resize(); } catch { /* ignore */ }
          }, 0);
          setTimeout(() => {
            try { calculator.resize(); } catch { /* ignore */ }
          }, 200);
          // Force-fill inner container as a fallback to CSS
          const host = boardRef.current.firstElementChild as HTMLElement | null;
          if (host) {
            host.style.position = 'absolute';
            (host.style as unknown as { inset?: string }).inset = '0';
            host.style.width = '100%';
            host.style.height = '100%';
          }
          const api = boardRef.current.querySelector('.dcg-calculator-api-container-v1_11') as HTMLElement | null;
          if (api) {
            api.style.position = 'absolute';
            (api.style as unknown as { inset?: string }).inset = '0';
            api.style.width = '100%';
            api.style.height = '100%';
          }
          const calc = boardRef.current.querySelector('.dcg-calculator, .dcg-container') as HTMLElement | null;
          if (calc) {
            calc.style.position = 'absolute';
            (calc.style as unknown as { inset?: string }).inset = '0';
            calc.style.width = '100%';
            calc.style.height = '100%';
          }
          const grapher = boardRef.current.querySelector('.dcg-grapher-2d') as HTMLElement | null;
          if (grapher) {
            grapher.style.visibility = 'visible';
            grapher.style.pointerEvents = 'auto';
            grapher.style.position = 'absolute';
            grapher.style.left = '0';
            grapher.style.top = '0';
            grapher.style.width = '100%';
            grapher.style.height = '100%';
            grapher.style.overflow = 'hidden';
          }
          console.log('[DesmosBoard] child host:', host?.className, host?.style.position, host?.style.height,
            '| api:', api?.className, api?.style.position, api?.style.height,
            '| calc:', calc?.className, calc?.style.position, calc?.style.height,
            '| grapher:', grapher?.className, grapher?.style.position, grapher?.style.height);
          // Quick visible line for sanity check
          calculator.setExpression({ id: 'debug-line', latex: 'y=x', color: '#ff0000' });
        } catch { /* ignore */ }
        
        // Set initial viewport and bring graph layer to front
        calculator.setMathBounds({
          left: -8,
          right: 8,
          bottom: -6,
          top: 6
        });
        try {
          const inner = boardRef.current?.querySelector('.dcg-graph-inner') as HTMLElement | null;
          const canvas = boardRef.current?.querySelector('.dcg-graph-inner canvas, .dcg-canvas-container canvas') as HTMLCanvasElement | null;
          if (inner) {
            inner.style.position = 'absolute';
            inner.style.left = '0';
            inner.style.top = '0';
            inner.style.width = '100%';
            inner.style.height = '100%';
            inner.style.visibility = 'visible';
            inner.style.opacity = '1';
            inner.style.zIndex = '1';
          }
          if (canvas) {
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
          }
        } catch {}

        // Ensure axes/grid/numbers are enabled explicitly
        try {
          calculator.updateSettings({
            showGrid: true,
            showXAxis: true,
            showYAxis: true,
            xAxisNumbers: true,
            yAxisNumbers: true
          } as unknown as Partial<Desmos.CalculatorSettings>);
        } catch {}

        // Create triangle points and lines
        createTriangle(calculator);
        
        // Set up event handlers
        setupEventHandlers(calculator);
        
        // Update lesson store
        setBoard(calculator);
        if (mode === 'ISOSCELES') {
          setValidator(createDesmosIsoscelesValidator({ board: calculator }));
        } else if (mode === 'RHA' || mode === 'RHS') {
          setValidator(createDesmosRightTriangleValidator({ 
            board: calculator, 
            mode: mode 
          }));
        } else {
          setValidator(null);
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Desmos initialization failed:', err);
        setError('Desmos 계산기 초기화에 실패했습니다.');
        setIsLoading(false);
      }
    };

    const createTriangle = (calculator: Desmos.Calculator) => {
      const points = trianglePoints;
      
      // Create triangle points as draggable points
      calculator.setExpression({
        id: 'point-A',
        latex: `A=(${points.A.x},${points.A.y})`,
        color: '#dc2626',
        pointSize: 8,
        dragMode: window.Desmos.DragModes.XY,
        showLabel: true,
        label: 'A'
      });
      
      calculator.setExpression({
        id: 'point-B',
        latex: `B=(${points.B.x},${points.B.y})`,
        color: '#2563eb',
        pointSize: 8,
        dragMode: window.Desmos.DragModes.XY,
        showLabel: true,
        label: 'B'
      });
      
      calculator.setExpression({
        id: 'point-C',
        latex: `C=(${points.C.x},${points.C.y})`,
        color: '#2563eb',
        pointSize: 8,
        dragMode: window.Desmos.DragModes.XY,
        showLabel: true,
        label: 'C'
      });
      
      // Create triangle sides
      calculator.setExpression({
        id: 'side-AB',
        latex: 'A B',
        color: '#000000',
        lineWidth: 2
      });
      
      calculator.setExpression({
        id: 'side-AC',
        latex: 'A C',
        color: '#000000',
        lineWidth: 2
      });
      
      calculator.setExpression({
        id: 'side-BC',
        latex: 'B C',
        color: '#000000',
        lineWidth: 2
      });
    };

    const setupEventHandlers = (calculator: Desmos.Calculator) => {
      // Handle point dragging and validation
      calculator.observeEvent('change', () => {
        // Update triangle points when user drags points
        const expressions = calculator.getExpressions();
        const newPoints = { ...trianglePoints };
        
        expressions.forEach(expr => {
          if (expr.id === 'point-A' && expr.latex) {
            const match = expr.latex.match(/A=\\left\\(([-\\d\\.]+),([-\\d\\.]+)\\right\\)/);
            if (match) {
              newPoints.A = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
            }
          }
          if (expr.id === 'point-B' && expr.latex) {
            const match = expr.latex.match(/B=\\left\\(([-\\d\\.]+),([-\\d\\.]+)\\right\\)/);
            if (match) {
              newPoints.B = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
            }
          }
          if (expr.id === 'point-C' && expr.latex) {
            const match = expr.latex.match(/C=\\left\\(([-\\d\\.]+),([-\\d\\.]+)\\right\\)/);
            if (match) {
              newPoints.C = { x: parseFloat(match[1]), y: parseFloat(match[2]) };
            }
          }
        });
        
        setTrianglePoints(newPoints);
        
        // Run validation if validator exists
        const currentValidator = useLessonStore.getState().runValidation;
        if (currentValidator) {
          try {
            currentValidator();
          } catch (error) {
            console.warn('Validation error:', error);
          }
        }
      });

      // Handle click events for tool interactions
      calculator.observeEvent('click', (evt: unknown) => {
        const math = (evt as { x: number; y: number });
        const currentTool = useLessonStore.getState().selectedTool;
        console.log('[DesmosBoard] Click event:', currentTool, 'at', math);
        handleToolClick(calculator, currentTool, math);
      });
    };

    const handleMultiPointTool = (calculator: Desmos.Calculator, tool: string, clickPoint: { x: number; y: number }) => {
      const scratchHost = (calculator as unknown as { scratch?: Scratch });
      const scratch = (scratchHost.scratch ||= {} as Scratch);
      if (!scratch.pendingPoints) scratch.pendingPoints = [];
      
      // Add current point to pending list
      scratch.pendingPoints.push(clickPoint);
      
      // Create temporary point to show selection
      const tempId = `temp-point-${Date.now()}`;
      calculator.setExpression({
        id: tempId,
        latex: `(${clickPoint.x.toFixed(2)}, ${clickPoint.y.toFixed(2)})`,
        color: '#f59e0b',
        pointSize: 4,
        showLabel: false
      });
      
      if (tool === 'segment' && scratch.pendingPoints.length === 2) {
        // Create segment between two points
        const [p1, p2] = scratch.pendingPoints;
        const segmentId = `user-segment-${Date.now()}`;
        calculator.setExpression({
          id: segmentId,
          latex: `\\left[(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}), (${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})\\right]`,
          color: '#000000',
          lineWidth: 2
        });
        
        // Track for undo functionality
        scratch.created = scratch.created || [];
        scratch.created.push(segmentId);
        
        // Clear pending points and temp points
        scratch.pendingPoints = [];
        calculator.getExpressions().forEach(expr => {
          if (expr.id && expr.id.startsWith('temp-point-')) {
            calculator.removeExpression({ id: expr.id });
          }
        });
      } else if (tool === 'line' && scratch.pendingPoints.length === 2) {
        // Create infinite line through two points
        const [p1, p2] = scratch.pendingPoints;
        const lineId = `user-line-${Date.now()}`;
        
        // Calculate line equation: y = mx + b or x = c for vertical lines
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        
        let latex;
        if (Math.abs(dx) < 0.01) {
          // Vertical line
          latex = `x = ${p1.x.toFixed(2)}`;
        } else {
          const slope = dy / dx;
          const intercept = p1.y - slope * p1.x;
          latex = `y = ${slope.toFixed(3)} \\cdot x + ${intercept.toFixed(3)}`;
        }
        
        calculator.setExpression({
          id: lineId,
          latex: latex,
          color: '#666666',
          lineWidth: 1
        });
        
        // Track for undo functionality
        scratch.created = scratch.created || [];
        scratch.created.push(lineId);
        
        // Clear pending points and temp points
        scratch.pendingPoints = [];
        calculator.getExpressions().forEach(expr => {
          if (expr.id && expr.id.startsWith('temp-point-')) {
            calculator.removeExpression({ id: expr.id });
          }
        });
      }
    };

    const handleToolClick = (calculator: Desmos.Calculator, tool: ToolId, clickPoint: { x: number; y: number }) => {
      console.log('[DesmosBoard] handleToolClick:', tool, clickPoint);
      
      switch (tool) {
        case 'point': {
          // Create a new point at click location
          const pointId = `user-point-${Date.now()}`;
          calculator.setExpression({
            id: pointId,
            latex: `(${clickPoint.x.toFixed(2)}, ${clickPoint.y.toFixed(2)})`,
            color: '#16a085',
            pointSize: 6,
            dragMode: window.Desmos.DragModes.XY,
            showLabel: true,
            label: `P${Math.floor(Math.random() * 100)}`
          });
          
          // Track for undo functionality
          const scratchHost = (calculator as unknown as { scratch?: Scratch });
          const scratch = (scratchHost.scratch ||= {} as Scratch);
          scratch.created = scratch.created || [];
          scratch.created.push(pointId);
          break;
        }
          
        case 'segment':
          // Store click point for two-point segment creation
          handleMultiPointTool(calculator, 'segment', clickPoint);
          break;
          
        case 'line':
          // Store click point for two-point line creation
          handleMultiPointTool(calculator, 'line', clickPoint);
          break;
          
        case 'delete': {
          // Find user-created expressions near the click point and delete the most recent one
          const deleteExpressions = calculator.getExpressions();
          const userCreatedIds = deleteExpressions
            .filter(expr => typeof expr.id === 'string' && (expr.id.startsWith('user-') || expr.id.startsWith('tool-') || expr.id.startsWith('temp-')))
            .map(expr => expr.id as string)
            .reverse(); // Most recent first
          
          if (userCreatedIds.length > 0) {
            const toDelete = userCreatedIds[0];
            calculator.removeExpression({ id: toDelete });
            
            // Remove from created tracking array
            const scratchHost = (calculator as unknown as { scratch?: Scratch });
            const deleteScratch = (scratchHost.scratch ||= {} as Scratch);
            if (deleteScratch.created) {
              deleteScratch.created = deleteScratch.created.filter((id: string) => id !== toDelete);
            }
            
            console.log('[DesmosBoard] Deleted expression:', toDelete);
          }
          break;
        }
          
        default:
          console.log('[DesmosBoard] Tool not implemented for clicks:', tool);
          break;
      }
    };

    // Start initialization after ensuring DOM is ready
    const startInitialization = () => {
      const win2 = window as WinWithDesmosFlags;
      console.log('[DesmosBoard] Checking if ready to initialize...', {
        mounted: isMounted,
        domReady: !!boardRef.current,
        desmosReady: !!(win2.Desmos)
      });
      
      if (isMounted && boardRef.current && win2.Desmos) {
        console.log('[DesmosBoard] Starting initialization...');
        initializeDesmos();
      } else if (isMounted) {
        console.log('[DesmosBoard] DOM/Desmos not ready, retrying in 150ms...');
        setTimeout(startInitialization, 150);
      }
    };
    
    // Start with a small delay to ensure DOM is mounted
    setTimeout(startInitialization, 100);

    return () => {
      isMounted = false;
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
      setBoard(null);
      setValidator(null);
    };
  }, [mode, setBoard, setValidator]);

  // Handle tool interactions and visual feedback
  useEffect(() => {
    const calculator = calculatorRef.current;
    if (!calculator) return;

    console.log('[DesmosBoard] Tool changed to:', selectedTool);

    // Clear any previous tool-specific expressions
    calculator.getExpressions().forEach(expr => {
      if (expr.id && expr.id.startsWith('tool-')) {
        calculator.removeExpression({ id: expr.id });
      }
    });

    // Implement tool-specific logic and visual feedback
    switch (selectedTool) {
      case 'select':
        // Default selection mode - no special visuals
        break;
      
      case 'point':
        // Add visual hint for point creation
        console.log('[DesmosBoard] Point tool selected - click to create points');
        break;
      
      case 'line':
        // Add instruction for line tool
        console.log('[DesmosBoard] Line tool selected - click two points to create line');
        break;
        
      case 'segment':
        // Add instruction for segment tool
        console.log('[DesmosBoard] Segment tool selected - click two points to create segment');
        break;
        
      case 'angle':
        // Show angle measurements with better formatting
        try {
          calculator.setExpression({
            id: 'tool-angle-A',
            latex: '\\text{∠BAC = }\\frac{180}{\\pi} \\arccos\\left(\\frac{(B-A) \\cdot (C-A)}{|B-A| |C-A|}\\right)',
            color: '#f59e0b',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-angle-B',
            latex: '\\text{∠ABC = }\\frac{180}{\\pi} \\arccos\\left(\\frac{(A-B) \\cdot (C-B)}{|A-B| |C-B|}\\right)',
            color: '#10b981',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-angle-C',
            latex: '\\text{∠ACB = }\\frac{180}{\\pi} \\arccos\\left(\\frac{(A-C) \\cdot (B-C)}{|A-C| |B-C|}\\right)',
            color: '#10b981',
            hidden: false
          });
        } catch (error) {
          console.warn('[DesmosBoard] Error creating angle measurements:', error);
        }
        break;
        
      case 'measure':
        // Show distance and angle measurements
        try {
          // Distance measurements with values
          calculator.setExpression({
            id: 'tool-measure-AB',
            latex: 'd_{AB} = \\sqrt{(A.x - B.x)^2 + (A.y - B.y)^2}',
            color: '#6b7280',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-measure-AC',
            latex: 'd_{AC} = \\sqrt{(A.x - C.x)^2 + (A.y - C.y)^2}',
            color: '#6b7280',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-measure-BC',
            latex: 'd_{BC} = \\sqrt{(B.x - C.x)^2 + (B.y - C.y)^2}',
            color: '#6b7280',
            hidden: false
          });
          
          // Angle measurements
          calculator.setExpression({
            id: 'tool-measure-angle-A',
            latex: '\\alpha_A = \\arccos\\left(\\frac{(B.x-A.x)(C.x-A.x) + (B.y-A.y)(C.y-A.y)}{\\sqrt{(B.x-A.x)^2+(B.y-A.y)^2} \\cdot \\sqrt{(C.x-A.x)^2+(C.y-A.y)^2}}\\right) \\cdot \\frac{180}{\\pi}',
            color: '#f59e0b',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-measure-angle-B',
            latex: '\\alpha_B = \\arccos\\left(\\frac{(A.x-B.x)(C.x-B.x) + (A.y-B.y)(C.y-B.y)}{\\sqrt{(A.x-B.x)^2+(A.y-B.y)^2} \\cdot \\sqrt{(C.x-B.x)^2+(C.y-B.y)^2}}\\right) \\cdot \\frac{180}{\\pi}',
            color: '#10b981',
            hidden: false
          });
          calculator.setExpression({
            id: 'tool-measure-angle-C',
            latex: '\\alpha_C = \\arccos\\left(\\frac{(A.x-C.x)(B.x-C.x) + (A.y-C.y)(B.y-C.y)}{\\sqrt{(A.x-C.x)^2+(A.y-C.y)^2} \\cdot \\sqrt{(B.x-C.x)^2+(B.y-C.y)^2}}\\right) \\cdot \\frac{180}{\\pi}',
            color: '#10b981',
            hidden: false
          });
          
          // Track for undo functionality
          const scratchMeasHost = (calculator as unknown as { scratch?: Scratch });
          const scratch = (scratchMeasHost.scratch ||= {} as Scratch);
          scratch.created = scratch.created || [];
          scratch.created.push('tool-measure-AB', 'tool-measure-AC', 'tool-measure-BC', 'tool-measure-angle-A', 'tool-measure-angle-B', 'tool-measure-angle-C');
          
        } catch (error) {
          console.warn('[DesmosBoard] Error creating measurements:', error);
        }
        break;
        
      case 'bisector':
        if (mode === 'ISOSCELES') {
          try {
            // Create angle bisector from A that bisects angle BAC
            
            // Angle bisector line equation
            calculator.setExpression({
              id: 'tool-bisector-line',
              latex: `\\frac{x - A.x}{\\frac{B.x - A.x}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2}} + \\frac{C.x - A.x}{\\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}} = \\frac{y - A.y}{\\frac{B.y - A.y}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2}} + \\frac{C.y - A.y}{\\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}}`,
              color: '#8b5cf6',
              lineStyle: 'DASHED',
              lineWidth: 2
            });
            
            // Intersection point D with line BC
            calculator.setExpression({
              id: 'tool-bisector-point-D',
              latex: `D = \\left(\\frac{C.x \\cdot \\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + B.x \\cdot \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}, \\frac{C.y \\cdot \\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + B.y \\cdot \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}\\right)`,
              color: '#8b5cf6',
              pointSize: 6,
              showLabel: true,
              label: 'D',
              dragMode: window.Desmos.DragModes.NONE
            });
            
            // Track for undo functionality
            const scratchBisHost = (calculator as unknown as { scratch?: Scratch });
            const scratch = (scratchBisHost.scratch ||= {} as Scratch);
            scratch.created = scratch.created || [];
            scratch.created.push('tool-bisector-line', 'tool-bisector-point-D');
            
          } catch (error) {
            console.warn('[DesmosBoard] Error creating bisector:', error);
          }
        }
        break;

      case 'intersection':
        console.log('[DesmosBoard] Intersection tool selected - click objects to find intersections');
        break;
        
      case 'delete':
        console.log('[DesmosBoard] Delete tool selected - click objects to delete them');
        break;
        
      default:
        console.log('[DesmosBoard] Unknown tool selected:', selectedTool);
        break;
    }
  }, [selectedTool, mode]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">오류 발생</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div
        ref={boardRef}
        className="w-full h-full geometry-board-container"
        style={{ minHeight: '560px' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <div className="text-gray-600">기하학 도구를 로딩 중입니다...</div>
          </div>
        </div>
      )}
      
      {mode === 'ISOSCELES' ? (
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">이등변삼각형 ABC</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• AB = AC</li>
            <li>• A: 꼭지각</li>
            <li>• B, C: 밑각</li>
          </ul>
        </div>
      ) : (
        <RhaRhsBoardInfo />
      )}
      
      <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md">
        <p className="text-xs text-blue-800">점을 드래그하여 삼각형을 조작하세요.</p>
      </div>
      
      {mode === 'ISOSCELES' && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button 
            className="px-3 py-1 text-xs rounded bg-purple-600 text-white shadow hover:bg-purple-700"
            onClick={() => {
              const calculator = calculatorRef.current;
              if (!calculator) return;
              
              try {
                // Create proper angle bisector from A that bisects angle BAC
                calculator.setExpression({
                  id: 'tool-bisector-line',
                  latex: `\\frac{x - A.x}{\\frac{B.x - A.x}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2}} + \\frac{C.x - A.x}{\\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}} = \\frac{y - A.y}{\\frac{B.y - A.y}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2}} + \\frac{C.y - A.y}{\\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}}`,
                  color: '#8b5cf6',
                  lineStyle: 'DASHED',
                  lineWidth: 2
                });
                
                // Mark intersection point D using angle bisector theorem
                calculator.setExpression({
                  id: 'tool-bisector-point-D',
                  latex: `D = \\left(\\frac{C.x \\cdot \\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + B.x \\cdot \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}, \\frac{C.y \\cdot \\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + B.y \\cdot \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}{\\sqrt{(B.x - A.x)^2 + (B.y - A.y)^2} + \\sqrt{(C.x - A.x)^2 + (C.y - A.y)^2}}\\right)`,
                  color: '#8b5cf6',
                  pointSize: 6,
                  showLabel: true,
                  label: 'D',
                  dragMode: window.Desmos.DragModes.NONE
                });
                
                // Track for undo functionality
                const scratchBtnHost = (calculator as unknown as { scratch?: Scratch });
                const scratch = (scratchBtnHost.scratch ||= {} as Scratch);
                (scratch.created ||= []).push('tool-bisector-line', 'tool-bisector-point-D');
                
              } catch (error) {
                console.warn('[DesmosBoard] Error creating bisector button:', error);
              }
            }}
          >
            보조선 AD 만들기
          </button>
        </div>
      )}
    </div>
  );
};

export default GeometryBoard;