import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const ScorePanel: React.FC = () => {
  const scoreData = useGameStore((s) => s.state.score);

  return (
    <div className="p-4 bg-gray-700 rounded-lg shadow-md w-40 select-none">
      <h2 className="text-lg font-semibold text-neon-pink mb-2 text-center">SCORE</h2>
      <div className="text-2xl font-bold text-white mb-1 text-right">{scoreData.score.toLocaleString()}</div>
      
      <div className="mt-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">LEVEL:</span>
          <span className="text-white font-medium">{scoreData.level}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">LINES:</span>
          <span className="text-white font-medium">{scoreData.lines}</span>
        </div>
      </div>
    </div>
  );
};

export default ScorePanel; 