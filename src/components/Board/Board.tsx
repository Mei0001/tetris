import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { CellType, TetrominoType } from '../../types'; // TetrominoTypeを追加

interface BoardCellProps {
  type: CellType;
  tetrominoType?: TetrominoType; // ピースの種類に応じて色を変えるために追加
}

// セルの色を決定するヘルパー関数 (仮)
const getCellColor = (type: CellType, tetrominoType?: TetrominoType): string => {
  if (tetrominoType) {
    switch (tetrominoType) {
      case 'I': return 'bg-cyan-500';
      case 'O': return 'bg-yellow-500';
      case 'T': return 'bg-purple-500';
      case 'S': return 'bg-green-500';
      case 'Z': return 'bg-red-500';
      case 'J': return 'bg-blue-500';
      case 'L': return 'bg-orange-500';
      default: break;
    }
  }
  switch (type) {
    case 'filled':
      return 'bg-gray-400'; // 通常の固定ブロック (tetrominoTypeがない場合)
    case 'ghost':
      return 'bg-gray-600 opacity-50';
    case 'active':
      return 'bg-opacity-0'; // アクティブピースはピース自体の色を使うので透明に
    case 'empty':
    default:
      return 'bg-gray-800';
  }
};

const BoardCell: React.FC<BoardCellProps> = ({ type, tetrominoType }) => {
  const color = getCellColor(type, tetrominoType);
  return <div className={`w-6 h-6 border border-gray-700 ${color}`}></div>;
};

const Board: React.FC = () => {
  const board = useGameStore((s) => s.state.board);
  const currentPiece = useGameStore((s) => s.state.currentPiece);
  const ghostPiecePosition = useGameStore((s) => {
    // 簡単なゴーストピースの位置計算（本来はgameLogicなどで行うべき）
    // ここでは currentPiece がある場合にのみ、一番下まで落とした位置を雑に計算する
    if (!s.state.currentPiece || !s.state.board) return null;
    let ghostY = s.state.currentPiece.position.y;
    while (
      !s.state.currentPiece.shape.some((row, yOffset) =>
        row.some((cell, xOffset) =>
          cell &&
          (ghostY + yOffset + 1 >= s.state.boardHeight ||
            (s.state.board[ghostY + yOffset + 1]?.[s.state.currentPiece!.position.x + xOffset] !== 'empty' && 
             s.state.board[ghostY + yOffset + 1]?.[s.state.currentPiece!.position.x + xOffset] !== 'ghost') // ghost自体は無視
            )
        )
      )
    ) {
      ghostY++;
    }
    return { ...s.state.currentPiece.position, y: ghostY };
  });

  // 描画用のボード配列を生成（アクティブピースとゴーストピースを合成）
  const displayBoard = board.map(row => row.map(cell => ({ type: cell, tetrominoType: undefined as TetrominoType | undefined })));

  // ゴーストピースを描画ボードに反映
  if (currentPiece && ghostPiecePosition && currentPiece.shape) {
    currentPiece.shape.forEach((row, yOffset) => {
      row.forEach((cell, xOffset) => {
        if (cell) {
          const boardX = ghostPiecePosition.x + xOffset;
          const boardY = ghostPiecePosition.y + yOffset;
          if (displayBoard[boardY]?.[boardX]?.type === 'empty') { // 空のセルにのみゴースト表示
            displayBoard[boardY][boardX] = { type: 'ghost', tetrominoType: currentPiece.type };
          }
        }
      });
    });
  }

  // アクティブなピースを描画ボードに反映 (ゴーストより手前)
  if (currentPiece && currentPiece.shape) {
    currentPiece.shape.forEach((row, yOffset) => {
      row.forEach((cell, xOffset) => {
        if (cell) {
          const boardX = currentPiece.position.x + xOffset;
          const boardY = currentPiece.position.y + yOffset;
          // ボード範囲内かつ、元々emptyかghostだった場所にアクティブピースを描画
          if (displayBoard[boardY]?.[boardX] && (displayBoard[boardY][boardX].type === 'empty' || displayBoard[boardY][boardX].type === 'ghost')) {
            displayBoard[boardY][boardX] = { type: 'active', tetrominoType: currentPiece.type };
          }
        }
      });
    });
  }

  return (
    <div className="grid gap-px bg-black border border-gray-500" 
         style={{ gridTemplateColumns: `repeat(${board[0]?.length || 10}, 1fr)` }}>
      {displayBoard.map((row, y) =>
        row.map((cellInfo, x) => (
          <BoardCell key={`${y}-${x}`} type={cellInfo.type} tetrominoType={cellInfo.tetrominoType} />
        ))
      )}
    </div>
  );
};

export default Board; 