/**
 * Geometry Toolbox Component
 * 
 * This component provides a comprehensive toolbar of geometric construction tools
 * for the interactive geometry board. Users can select different tools to create
 * points, lines, angles, measurements, and other geometric objects.
 * 
 * Features:
 * - Visual tool selection with icons and descriptions
 * - Keyboard shortcuts (number keys 1-9 for quick tool switching)
 * - Active tool highlighting with visual feedback
 * - Hover tooltips showing tool descriptions
 * - Responsive layout that works across different screen sizes
 * 
 * Available Tools:
 * - Select: Object selection and movement
 * - Point: Create points by clicking
 * - Line: Draw infinite lines through two points
 * - Segment: Draw line segments between points
 * - Angle: Create angle measurements and displays
 * - Bisector: Construct angle bisectors
 * - Intersection: Find intersection points between objects
 * - Measure: Measure distances and angles
 * - Delete: Remove objects from the board
 */

import { useEffect } from 'react';
import { useLessonStore } from '../../state/lessonStore';
import type { ToolId } from '../../state/lessonStore';

/**
 * Interface defining the structure of a geometric tool
 */
interface Tool {
  /** Unique identifier for the tool */
  id: ToolId;
  
  /** Korean display name for the tool */
  name: string;
  
  /** Visual icon or symbol representing the tool */
  icon: string;
  
  /** Detailed description of what the tool does */
  description: string;
}

/**
 * Array of available geometric tools with their configurations
 * 
 * Each tool has a unique ID, Korean name, visual icon, and description.
 * The order here determines the display order in the toolbox.
 */
const tools: Tool[] = [
  { id: 'select', name: '선택', icon: '⟪', description: '객체 선택 및 이동' },
  { id: 'point', name: '점', icon: '•', description: '점 생성' },
  { id: 'line', name: '직선', icon: '—', description: '직선 그리기' },
  { id: 'segment', name: '선분', icon: '―', description: '선분 그리기' },
  { id: 'angle', name: '각', icon: '∠', description: '각 표시' },
  { id: 'bisector', name: '이등분선', icon: '∿', description: '각의 이등분선' },
  { id: 'intersection', name: '교점', icon: '⋈', description: '교점 생성' },
  { id: 'measure', name: '측정', icon: '📏', description: '길이 및 각도 측정' },
  { id: 'delete', name: '삭제', icon: '🗑', description: '객체 삭제' },
];

/**
 * Main toolbox component for geometric tool selection
 * 
 * Renders a horizontal toolbar with all available geometric tools.
 * Handles tool selection, keyboard shortcuts, and visual feedback.
 * 
 * @returns JSX element containing the complete toolbox interface
 */
const Toolbox = () => {
  const selectedTool = useLessonStore((s) => s.selectedTool);
  const setSelectedTool = useLessonStore((s) => s.setSelectedTool);

  // 숫자키로 도구 전환
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = {
        '1': 'select',
        '2': 'point',
        '3': 'line',
        '4': 'segment',
        '5': 'angle',
        '6': 'bisector',
        '7': 'intersection',
        '8': 'measure',
        '9': 'delete',
      };
      const next = map[e.key];
      if (next) setSelectedTool(next as ToolId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setSelectedTool]);

  return (
    <div className="flex items-center space-x-2 overflow-x-auto select-none">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => {
            console.log('[Toolbox] select tool =', tool.id);
            setSelectedTool(tool.id);
          }}
          className={`flex flex-col items-center justify-center min-w-[60px] h-16 px-2 py-1 rounded-md transition-colors ${
            selectedTool === tool.id
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
          title={tool.description}
        >
          <span className="text-lg mb-1">{tool.icon}</span>
          <span className="text-xs font-medium">{tool.name}</span>
        </button>
      ))}
      
      <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
        <button
          onClick={useLessonStore.getState().undoLast}
          className="p-2 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="실행 취소"
        >
          ↶
        </button>
        <button
          onClick={useLessonStore.getState().clearCreated}
          className="p-2 text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="모두 지우기"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Toolbox;
