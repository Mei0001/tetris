import type { TetrominoType } from '../types';
import { TETROMINO_TYPES } from '../constants/tetrominos';

let currentBag: TetrominoType[] = [];

/**
 * 新しい7-bagを生成する
 */
function generateNewBag(): TetrominoType[] {
  const newBag = [...TETROMINO_TYPES];
  // Fisher-Yates shuffle
  for (let i = newBag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newBag[i], newBag[j]] = [newBag[j], newBag[i]];
  }
  return newBag;
}

/**
 * 7-bagランダマイザから次のテトロミノタイプを取得する
 */
export function getRandomTetrominoType(): TetrominoType {
  if (currentBag.length === 0) {
    currentBag = generateNewBag();
  }
  return currentBag.pop()!;
}

/**
 * 7-bagの状態をリセットする（テスト用など）
 */
export function resetBag() {
  currentBag = [];
} 