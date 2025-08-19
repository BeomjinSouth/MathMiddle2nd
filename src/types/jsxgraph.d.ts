declare module 'jsxgraph' {
  export interface JXGBoard {
    create: (elementType: string, params: any[], attributes?: any) => any;
    addChild: (element: any) => void;
    removeChild: (element: any) => void;
    update: () => void;
    getBoundingBox: () => number[];
    setBoundingBox: (bbox: number[]) => void;
  }

  export interface JSXGraphOptions {
    boundingbox: number[];
    axis: boolean;
    showCopyright: boolean;
    showNavigation: boolean;
    zoom: boolean;
    pan: boolean;
    grid: boolean;
  }

  export interface JXG {
    initBoard: (containerId: string, options: JSXGraphOptions) => JXGBoard;
    freeBoard: (board: JXGBoard) => void;
  }

  const JXG: JXG;
  export default JXG;
}
