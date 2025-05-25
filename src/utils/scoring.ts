import { LINE_CLEAR_SCORES, T_SPIN_SCORES, PERFECT_CLEAR_BONUS, BACK_TO_BACK_MULTIPLIER, COMBO_BASE_SCORE } from '../constants/game';
import type { LineClearType, ScoreData } from '../types';

/** ライン消去時のスコアを計算（T-Spin系は除外） */
export function calcLineClearScore(type: keyof typeof LINE_CLEAR_SCORES, backToBack: boolean): number {
  let base = LINE_CLEAR_SCORES[type] as number;
  if (backToBack && type === 'tetris') {
    base = Math.floor(base * BACK_TO_BACK_MULTIPLIER) as number;
  }
  return base;
}

/** T-Spin時のスコアを計算 */
export function calcTSpinScore(type: keyof typeof T_SPIN_SCORES, backToBack: boolean): number {
  let base = T_SPIN_SCORES[type] as number;
  if (backToBack && (type === 'tSpinDouble' || type === 'tSpinTriple')) {
    base = Math.floor(base * BACK_TO_BACK_MULTIPLIER) as number;
  }
  return base;
}

/** Perfect Clear時のボーナスを返す */
export function getPerfectClearBonus(): number {
  return PERFECT_CLEAR_BONUS;
}

/** コンボスコアを計算 */
export function calcComboScore(combo: number): number {
  return combo > 0 ? COMBO_BASE_SCORE * combo : 0;
}

/**
 * ライン消去数に応じたスコアを返す（クラシックTetris基準）
 */
export function getLineClearScore(lines: number, level: number): number {
  const table = [0, 40, 100, 300, 1200];
  return (table[lines] || 0) * level;
}

/**
 * ハイスコアをlocalStorageから取得
 */
export function getHighScore(mode: string): number {
  const key = `tetris_high_score_${mode}`;
  const value = localStorage.getItem(key);
  return value ? parseInt(value, 10) : 0;
}

/**
 * ハイスコアをlocalStorageに保存
 */
export function setHighScore(mode: string, score: number): void {
  const key = `tetris_high_score_${mode}`;
  const prev = getHighScore(mode);
  if (score > prev) {
    localStorage.setItem(key, score.toString());
  }
} 