import { useEffect, useRef } from 'react';
// @ts-ignore
import JXG from 'jsxgraph';

const GeometryBoard = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoardRef = useRef<any>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    // JSXGraph 보드 초기화
    // @ts-ignore
    const board = JXG.initBoard(boardRef.current.id, {
      boundingbox: [-8, 8, 8, -8],
      axis: true,
      showCopyright: false,
      showNavigation: true,
      zoom: true,
      pan: true,
      grid: true,
    });

    jxgBoardRef.current = board;

    // 기본 이등변삼각형 생성
    const A = board.create('point', [0, 4], { 
      name: 'A', 
      size: 4, 
      fillColor: 'red',
      strokeColor: 'red'
    });
    
    const B = board.create('point', [-3, -2], { 
      name: 'B', 
      size: 4, 
      fillColor: 'blue',
      strokeColor: 'blue'
    });
    
    const C = board.create('point', [3, -2], { 
      name: 'C', 
      size: 4, 
      fillColor: 'blue',
      strokeColor: 'blue'
    });

    // 삼각형의 변 그리기
    board.create('segment', [A, B], { 
      strokeColor: 'black', 
      strokeWidth: 2 
    });
    
    board.create('segment', [A, C], { 
      strokeColor: 'black', 
      strokeWidth: 2 
    });
    
    board.create('segment', [B, C], { 
      strokeColor: 'black', 
      strokeWidth: 2 
    });

    // 각도 표시
    board.create('angle', [B, A, C], {
      type: 'sector',
      orthoType: 'square',
      radius: 1,
      fillColor: 'yellow',
      fillOpacity: 0.3,
      strokeColor: 'orange'
    });

    board.create('angle', [A, B, C], {
      type: 'sector',
      orthoType: 'square',
      radius: 0.8,
      fillColor: 'lightgreen',
      fillOpacity: 0.3,
      strokeColor: 'green'
    });

    board.create('angle', [A, C, B], {
      type: 'sector',
      orthoType: 'square',
      radius: 0.8,
      fillColor: 'lightgreen',
      fillOpacity: 0.3,
      strokeColor: 'green'
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (jxgBoardRef.current) {
        // @ts-ignore
        JXG.freeBoard(jxgBoardRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <div
        id="jxgbox"
        ref={boardRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
      
      {/* 오버레이 정보 */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-md">
        <h3 className="font-semibold text-sm text-gray-800 mb-2">이등변삼각형 ABC</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• AB = AC (이등변삼각형)</li>
          <li>• A: 꼭지각</li>
          <li>• B, C: 밑각</li>
        </ul>
      </div>

      {/* 도구 힌트 */}
      <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-md">
        <p className="text-xs text-blue-800">
          💡 상단 도구모음에서 도구를 선택하여 작업을 시작하세요
        </p>
      </div>
    </div>
  );
};

export default GeometryBoard;
