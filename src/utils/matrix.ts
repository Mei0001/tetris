import type { GameBoard, CellType, Position, TetrominoShape, Tetromino } from '../types';

/** 2次元配列をディープコピー */
export function cloneMatrix<T>(matrix: T[][]): T[][] {
  return matrix.map(row => [...row]);
}

/** 2次元配列を指定値で初期化 */
export function createMatrix<T>(width: number, height: number, fill: T): T[][] {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

/** 2次元配列を時計回りに90度回転 */
export function rotateMatrixCW<T>(matrix: T[][]): T[][] {
  const size = matrix.length;
  const result = createMatrix<T>(size, size, matrix[0][0]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[x][size - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

/** 2次元配列を反時計回りに90度回転 */
export function rotateMatrixCCW<T>(matrix: T[][]): T[][] {
  const size = matrix.length;
  const result = createMatrix<T>(size, size, matrix[0][0]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      result[size - 1 - x][y] = matrix[y][x];
    }
  }
  return result;
}

/** 2次元配列を180度回転 */
export function rotateMatrix180<T>(matrix: T[][]): T[][] {
  return rotateMatrixCW(rotateMatrixCW(matrix));
}

/**
 * 指定座標(x, y)がボード範囲内か判定
 * @param x X座標
 * @param y Y座標
 * @param board 対象ボード
 */
export function isInsideBoard(x: number, y: number, board: GameBoard): boolean {
  return y >= 0 && y < board.length && x >= 0 && x < (board[0]?.length || 0);
}

/**
 * 完成したラインのインデックス配列を返す
 */
export function getFullLines(board: GameBoard): number[] {
  return board.reduce((acc, row, i) => {
    if (row.every(cell => cell === 'filled')) acc.push(i);
    return acc;
  }, [] as number[]);
}

/**
 * 指定したラインを消去し、上のブロックを下に詰めた新しいボードを返す
 */
export function removeLinesAndShiftDown(board: GameBoard, lines: number[]): GameBoard {
  const width = board[0]?.length || 0;
  if (width === 0) return [];
  let newBoard = board.filter((_, i) => !lines.includes(i));
  const emptyRows = Array.from({ length: lines.length }, () => Array(width).fill('empty' as CellType));
  return [...emptyRows, ...newBoard];
}

/**
 * 消去後のボードを下に詰める（collapse）
 * ※clearLinesで十分な場合は省略可
 */
export function collapseBoard(board: GameBoard): GameBoard {
  if (board.length === 0 || board[0].length === 0) return [];
  return board.sort((a, b) => {
    const aEmpty = a.every(cell => cell === 'empty');
    const bEmpty = b.every(cell => cell === 'empty');
    return aEmpty === bEmpty ? 0 : aEmpty ? -1 : 1;
  });
}

/**
 * 盤面が全て空かチェックする (Perfect Clear判定用)
 * @param board ゲーム盤面
 * @returns boolean 全て空ならtrue
 */
export const isBoardEmpty = (board: GameBoard): boolean => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== 'empty') {
        return false;
      }
    }
  }
  return true;
};

/**
 * 指定されたピースを盤面に固定（マージ）した新しい盤面を返す
 * @param board 現在の盤面
 * @param piece 固定するピース
 * @returns ピースが固定された新しい盤面
 */
export const placePieceOnBoard = (board: GameBoard, piece: Tetromino): GameBoard => {
  const newBoard = cloneMatrix(board);
  const { shape, position, type } = piece;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        if (boardY >= 0 && boardY < newBoard.length && boardX >= 0 && boardX < (newBoard[0]?.length || 0)) {
          newBoard[boardY][boardX] = 'filled';
        }
      }
    }
  }
  return newBoard;
}; 