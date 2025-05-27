import React, { useEffect, useState } from 'react';
import type { GameMode } from '../../types';
import { getHighScore } from '../../utils/scoring';

const MODES: { mode: GameMode; label: string }[] = [
  { mode: 'classic', label: 'Classic' },
  { mode: 'sprint', label: 'Sprint' },
  { mode: 'zen', label: 'Zen' },
  { mode: 'challenge', label: 'Challenge' },
];

interface StatisticsPanelProps {
  className?: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ className = '' }) => {
  const [scores, setScores] = useState<Record<GameMode, number>>({
    classic: 0,
    sprint: 0,
    zen: 0,
    challenge: 0,
  });

  useEffect(() => {
    const newScores: Record<GameMode, number> = { ...scores };
    MODES.forEach(({ mode }) => {
      newScores[mode] = getHighScore(mode);
    });
    setScores(newScores);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`bg-gray-800/90 rounded-xl shadow-lg p-6 w-full max-w-md mx-auto ${className}`}>
      <h2 className="text-xl font-bold text-neon-yellow mb-4 text-center drop-shadow">モード別ハイスコア</h2>
      <div className="grid grid-cols-2 gap-4">
        {MODES.map(({ mode, label }) => (
          <div key={mode} className="flex flex-col items-center justify-center p-3 bg-gray-700/80 rounded-lg border border-white/10">
            <span className="text-neon-cyan font-semibold text-lg mb-1">{label}</span>
            <span className="text-white text-2xl font-bold drop-shadow">{scores[mode]?.toLocaleString() ?? 0}</span>
            <span className="text-xs text-gray-400 mt-1">High Score</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsPanel; 