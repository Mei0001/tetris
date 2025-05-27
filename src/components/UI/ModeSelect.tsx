import React from 'react';
import type { GameMode } from '../../types';

interface ModeSelectProps {
  onSelect: (mode: GameMode) => void;
}

const MODES: { mode: GameMode; label: string; desc: string; color: string }[] = [
  { mode: 'classic', label: 'Classic', desc: 'スタンダードなテトリス', color: 'text-neon-cyan' },
  { mode: 'sprint', label: 'Sprint', desc: '40ラインタイムアタック', color: 'text-neon-yellow' },
  { mode: 'zen', label: 'Zen', desc: '無限に練習できる禅モード', color: 'text-neon-green' },
  { mode: 'challenge', label: 'Challenge', desc: '特殊ルールで腕試し', color: 'text-neon-pink' },
];

const ModeSelect: React.FC<ModeSelectProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-neon-purple mb-4 text-center drop-shadow">モード選択</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {MODES.map(({ mode, label, desc, color }) => (
          <button
            key={mode}
            className={`group rounded-xl border border-white/20 bg-gray-800/80 shadow-lg px-6 py-5 flex flex-col items-center focus:outline-none focus:ring-2 focus:ring-neon-pink transition hover:scale-105 hover:border-neon-pink ${color}`}
            onClick={() => onSelect(mode)}
            aria-label={label}
          >
            <span className="text-xl font-extrabold mb-1 drop-shadow-sm">{label}</span>
            <span className="text-xs text-gray-300 mb-2 text-center">{desc}</span>
            <span className="mt-2 w-8 h-1 rounded-full bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-yellow opacity-60 group-hover:opacity-100 transition" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelect; 