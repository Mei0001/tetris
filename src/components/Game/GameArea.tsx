import React from 'react';
import ScorePanel from '../UI/ScorePanel';
import NextPanel from '../UI/NextPanel';
import HoldPanel from '../UI/HoldPanel';
import type { GameBoard, TetrominoType } from '../../types';

interface GameAreaProps {
  board: GameBoard;
  score: number;
  level: number;
  lines: number;
  nextPieces: TetrominoType[];
  holdPiece: TetrominoType | null;
  canHold: boolean;
}

/**
 * ゲームボードとサイドパネル群をレスポンシブに並べるラッパー
 */
const GameArea: React.FC<GameAreaProps> = ({
  board,
  score,
  level,
  lines,
  nextPieces,
  holdPiece,
  canHold,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4">
      {/* サイドパネル（左/上） */}
      <div className="flex flex-row md:flex-col gap-2 order-2 md:order-1">
        <HoldPanel holdPiece={holdPiece} canHold={canHold} />
        <ScorePanel score={score} level={level} lines={lines} />
      </div>
      {/* ゲームボード中央 */}
      <div className="order-1 md:order-2">
        {/* GameBoardは親でimportして渡す想定 */}
        {/* <GameBoard board={board} /> */}
      </div>
      {/* サイドパネル（右/下） */}
      <div className="flex flex-col gap-2 order-3">
        <NextPanel nextPieces={nextPieces} />
      </div>
    </div>
  );
};

export default GameArea; 