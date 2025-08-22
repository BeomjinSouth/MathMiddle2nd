/**
 * Desmos API Type Definitions
 * 
 * TypeScript type definitions for the Desmos Graphing Calculator API.
 * These types enable proper TypeScript support for interactive mathematical
 * visualizations and geometry education tools.
 */

declare global {
  interface Window {
    Desmos: typeof Desmos;
  }
}

declare namespace Desmos {
  interface Calculator {
    setExpression(expression: Expression): void;
    getExpressions(): Expression[];
    removeExpression(expression: { id: string }): void;
    setBlank(): void;
    undo(): void;
    redo(): void;
    clearHistory(): void;
    getState(): State;
    setState(state: State): void;
    screenshot(opts?: ScreenshotOptions): string;
    observeEvent(event: string, callback: (evt: unknown) => void): void;
    unobserveEvent(event: string): void;
    resize(): void;
    destroy(): void;
    mathToPixels(point: MathCoordinates): PixelCoordinates;
    pixelsToMath(point: PixelCoordinates): MathCoordinates;
    setMathBounds(bounds: MathBounds): void;
    getMathBounds(): MathBounds;
    getViewport(): Viewport;
    setViewport(viewport: Viewport): void;
  }

  interface Expression {
    id?: string;
    latex?: string;
    color?: string;
    lineStyle?: LineStyle;
    lineWidth?: number;
    lineOpacity?: number;
    pointStyle?: PointStyle;
    pointSize?: number;
    pointOpacity?: number;
    fillOpacity?: number;
    hidden?: boolean;
    secret?: boolean;
    dragMode?: DragMode;
    label?: string;
    showLabel?: boolean;
    labelSize?: string;
    labelOrientation?: LabelOrientation;
    parametricDomain?: Domain;
    polarDomain?: Domain;
    domain?: Domain;
    cdf?: boolean;
    residualVariable?: string;
    regressionParameters?: { [key: string]: number };
    isLogModeRegression?: boolean;
    displayEvaluationAsFraction?: boolean;
    slider?: SliderBounds;
  }

  interface CalculatorOptions {
    keypad?: boolean;
    graphpaper?: boolean;
    expressions?: boolean;
    settingsMenu?: boolean;
    zoomButtons?: boolean;
    showResetButtonOnGraphpaper?: boolean;
    expressionsTopbar?: boolean;
    pointsOfInterest?: boolean;
    trace?: boolean;
    border?: boolean;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisNumbers?: boolean;
    yAxisNumbers?: boolean;
    polarNumbers?: boolean;
    lockViewport?: boolean;
    expressionsCollapsed?: boolean;
    images?: boolean;
    folders?: boolean;
    notes?: boolean;
    sliders?: boolean;
    links?: boolean;
    qwertyKeyboard?: boolean;
    restrictedFunctions?: boolean;
    forceEnableGeometryFunctions?: boolean;
    pasteGraphLink?: boolean;
    capExpressionSize?: boolean;
    language?: string;
  }

  interface State {
    version: number;
    randomSeed?: string;
    graph: GraphState;
    expressions: {
      list: Expression[];
    };
  }

  interface GraphState {
    viewport: Viewport;
    showGrid?: boolean;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisNumbers?: boolean;
    yAxisNumbers?: boolean;
  }

  interface Viewport {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  }

  interface MathBounds {
    left: number;
    right: number;
    bottom: number;
    top: number;
  }

  interface MathCoordinates {
    x: number;
    y: number;
  }

  interface PixelCoordinates {
    x: number;
    y: number;
  }

  interface Domain {
    min: string;
    max: string;
  }

  interface SliderBounds {
    hardMin?: boolean;
    hardMax?: boolean;
    animationPeriod?: number;
    loopMode?: LoopMode;
    playDirection?: PlayDirection;
    isPlaying?: boolean;
    min?: string;
    max?: string;
    step?: string;
  }

  interface ScreenshotOptions {
    width?: number;
    height?: number;
    targetPixelRatio?: number;
    preserveAxisNumbers?: boolean;
    mathBounds?: MathBounds;
    showExpressions?: boolean;
  }

  type LineStyle = 'SOLID' | 'DASHED' | 'DOTTED';
  type PointStyle = 'POINT' | 'OPEN' | 'CROSS';
  type DragMode = 'NONE' | 'X' | 'Y' | 'XY' | 'AUTO';
  type LabelOrientation = 'default' | 'center' | 'center_auto' | 'auto_center' | 'above' | 'above_left' | 'above_right' | 'below' | 'below_left' | 'below_right' | 'left' | 'right';
  type LoopMode = 'LOOP_FORWARD_REVERSE' | 'LOOP_FORWARD' | 'PLAY_ONCE' | 'PLAY_INDEFINITELY';
  type PlayDirection = 1 | -1;

  const DragModes: {
    NONE: DragMode;
    X: DragMode;
    Y: DragMode;
    XY: DragMode;
    AUTO: DragMode;
  };

  const Colors: {
    RED: string;
    BLUE: string;
    GREEN: string;
    ORANGE: string;
    PURPLE: string;
    BLACK: string;
    [key: string]: string;
  };

  function GraphingCalculator(element: HTMLElement, options?: CalculatorOptions): Calculator;
}

export = Desmos;
export as namespace Desmos;