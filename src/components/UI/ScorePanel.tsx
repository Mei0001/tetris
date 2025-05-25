import React from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
  highScore?: number;
  className?: string;
}

/**
 * スコア・レベル・ライン数・ハイスコア表示用サイドパネル
 */
const ScorePanel: React.FC<ScorePanelProps> = ({ score, level, lines, highScore, className = '' }) => {
  return (
    <div className={`bg-black/60 rounded-lg shadow-md border border-white/10 p-4 min-w-[120px] flex flex-col gap-2 ${className}`}>
      <div className="text-lg font-bold text-neon-cyan">SCORE</div>
      <div className="text-2xl font-mono neon-glow">{score}</div>
      {highScore !== undefined && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-neon-yellow">HI-SCORE</span>
          <span className="font-mono text-xs">{highScore}</span>
        </div>
      )}
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