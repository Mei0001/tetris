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