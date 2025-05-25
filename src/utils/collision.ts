import type { GameBoard, Tetromino, Position, CellType } from '../types';

/**
 * テトロミノが指定位置でボードと衝突するか判定
 */
export function isCollision(board: GameBoard, tetromino: Tetromino, pos: Position): boolean {
  const { pattern } = tetromino.shape;
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      if (!pattern[y][x]) continue;
      const boardX = pos.x + x;
      const boardY = pos.y + y;
      // ボード外 or 既に埋まっているセル
      if (
        boardY < 0 ||
        boardY >= board.length ||
        boardX < 0 ||
        boardX >= board[0].length ||
        board[boardY][boardX] !== 'empty'
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * テトロミノがボードの底または他のブロックに接しているか判定
 */
export function isTouchingGround(board: GameBoard, tetromino: Tetromino, pos: Position): boolean {
  const nextPos = { x: pos.x, y: pos.y + 1 };
  return isCollision(board, tetromino, nextPos);
} 