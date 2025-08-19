import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

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

const Toolbox = () => {
  const [selectedTool, setSelectedTool] = useState('select');

  return (
    <div className="flex items-center space-x-2 overflow-x-auto">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setSelectedTool(tool.id)}
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
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          title="실행 취소"
        >
          ↶
        </button>
        <button
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          title="다시 실행"
        >
          ↷
        </button>
        <button
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          title="모두 지우기"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Toolbox;
