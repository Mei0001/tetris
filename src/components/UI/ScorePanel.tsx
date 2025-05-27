import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const formatTime = (ms?: number) => {
  if (!ms) return '0.00';
  const sec = ms / 1000;
  return sec.toFixed(2);
};

const ScorePanel: React.FC = () => {
  const scoreData = useGameStore((s) => s.state.score);
  const mode = useGameStore((s) => s.state.mode);
  const sprintLinesCleared = useGameStore((s) => s.state.sprintLinesCleared);
  const sprintLinesGoal = useGameStore((s) => s.state.sprintLinesGoal);
  const elapsedTime = useGameStore((s) => s.state.elapsedTime);
  const status = useGameStore((s) => s.state.status);

  // Sprint Mode用タイム表示
  let sprintTime = elapsedTime;
  if (mode === 'sprint' && status === 'completed' && scoreData.time !== undefined) {
    sprintTime = scoreData.time;
  }

  return (
    <div className="p-4 bg-gray-700 rounded-lg shadow-md w-40 select-none">
      <h2 className="text-lg font-semibold text-neon-pink mb-2 text-center">SCORE</h2>
      <div className="text-2xl font-bold text-white mb-1 text-right">{scoreData.score.toLocaleString()}</div>
      {/* Sprint Mode用進行状況・タイム表示 */}
      {mode === 'sprint' ? (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">LINES:</span>
            <span className="text-white font-medium">{sprintLinesCleared ?? 0} / {sprintLinesGoal ?? 40}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">TIME:</span>
            <span className="text-white font-medium">{formatTime(sprintTime)}s</span>
          </div>
        </div>
      ) : mode === 'zen' ? (
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">TIME:</span>
            <span className="text-white font-medium">{formatTime(elapsedTime)}s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">LINES:</span>
            <span className="text-white font-medium">{scoreData.lines}</span>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ScorePanel; 