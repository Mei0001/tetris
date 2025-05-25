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