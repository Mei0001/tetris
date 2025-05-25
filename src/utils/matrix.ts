import type { CellType } from '../types';

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
export function isInsideBoard(x: number, y: number, board: unknown[][]): boolean {
  return y >= 0 && y < board.length && x >= 0 && x < board[0].length;
}

/**
 * 完成したラインのインデックス配列を返す
 */
export function getFullLines(board: unknown[][]): number[] {
  return board.reduce((acc, row, i) => {
    if (row.every(cell => cell !== 'empty')) acc.push(i);
    return acc;
  }, [] as number[]);
}

/**
 * 指定したラインを消去し、上から空行を追加した新しいボードを返す
 */
export function clearLines(board: unknown[][], lines: number[]): unknown[][] {
  const width = board[0].length;
  let newBoard = board.filter((_, i) => !lines.includes(i));
  const emptyRows = Array.from({ length: lines.length }, () => Array(width).fill('empty'));
  return [...emptyRows, ...newBoard];
}

/**
 * 消去後のボードを下に詰める（collapse）
 * ※clearLinesで十分な場合は省略可
 */
export function collapseBoard(board: unknown[][]): unknown[][] {
  // 空行を上に詰めるだけ
  return board.sort((a, b) => {
    const aEmpty = a.every(cell => cell === 'empty');
    const bEmpty = b.every(cell => cell === 'empty');
    return aEmpty === bEmpty ? 0 : aEmpty ? -1 : 1;
  });
} 