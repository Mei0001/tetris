import React from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
  className?: string;
}

/**
 * スコア・レベル・ライン数表示用サイドパネル
 */
const ScorePanel: React.FC<ScorePanelProps> = ({ score, level, lines, className = '' }) => {
  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[120px] flex flex-col gap-2 ${className}`}>
      <div className="text-lg font-bold text-neon-cyan">SCORE</div>
      <div className="text-2xl font-mono neon-glow">{score}</div>
      <div className="flex justify-between mt-2">
        <span className="text-sm text-neon-green">LEVEL</span>
        <span className="font-mono">{level}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-neon-yellow">LINES</span>
        <span className="font-mono">{lines}</span>
      </div>
    </div>
  );
};

export default ScorePanel; 