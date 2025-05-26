import { LINE_CLEAR_SCORES, T_SPIN_SCORES, PERFECT_CLEAR_BONUS, BACK_TO_BACK_MULTIPLIER, COMBO_BASE_SCORE, LINES_PER_LEVEL, MAX_LEVEL } from '../constants/game';
import type { LineClearType, ScoreData, TSpinType } from '../types';

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

export interface LineClearEvent {
  linesCleared: number;
  tSpinType: TSpinType; 
  isPerfectClear: boolean;
}

/**
 * イベントに基づいてスコアデータを更新する
 */
export function updateScore(currentScoreData: ScoreData, event: LineClearEvent): ScoreData {
  let scoreToAdd = 0;
  const newLines = currentScoreData.lines + event.linesCleared;
  const newLevel = Math.min(MAX_LEVEL, Math.floor(newLines / LINES_PER_LEVEL) + 1);
  let newCombo = 0;
  let newB2B = currentScoreData.backToBack;

  if (event.linesCleared > 0) {
    newCombo = currentScoreData.combo + 1;
    scoreToAdd += COMBO_BASE_SCORE * (newCombo -1) ;
    
    let basePoints = 0;
    let isDifficultClear = false; 

    if (event.tSpinType !== 'none') { // T-Spinによるライン消去
      isDifficultClear = true;
      switch (event.tSpinType) {
        case 'mini':
          if (event.linesCleared === 1) basePoints = T_SPIN_SCORES.tSpinMiniSingle;
          else if (event.linesCleared === 2) basePoints = T_SPIN_SCORES.tSpinMiniDouble;
          // No lines mini T-Spin はここでは扱わない (event.linesCleared > 0 のため)
          break;
        case 'regular':
          if (event.linesCleared === 1) basePoints = T_SPIN_SCORES.tSpinSingle;
          else if (event.linesCleared === 2) basePoints = T_SPIN_SCORES.tSpinDouble;
          else if (event.linesCleared === 3) basePoints = T_SPIN_SCORES.tSpinTriple;
          break;
      }
    } else { // 通常のライン消去
      switch (event.linesCleared) {
        case 1: basePoints = LINE_CLEAR_SCORES.single; break;
        case 2: basePoints = LINE_CLEAR_SCORES.double; break;
        case 3: basePoints = LINE_CLEAR_SCORES.triple; break;
        case 4: basePoints = LINE_CLEAR_SCORES.tetris; isDifficultClear = true; break;
      }
    }

    let currentActionScore = basePoints * newLevel;

    if (isDifficultClear) {
      if (newB2B) {
        currentActionScore = Math.floor(currentActionScore * BACK_TO_BACK_MULTIPLIER);
      }
      newB2B = true;
    } else {
      newB2B = false;
    }
    scoreToAdd += currentActionScore;

    if (event.isPerfectClear) {
      // Perfect Clearボーナス。ライン数に関わらず固定値を加算 + レベル補正が良いか
      // 例：Tetris Guidelineでは状況により 800, 1000, 1200, ... 3200など
      // ここでは、基本ボーナス + 消したライン数に応じた追加ボーナスとする
      const pcBaseBonus = PERFECT_CLEAR_BONUS; // 1000
      const pcLineBonus = event.linesCleared * 100 * newLevel; // 仮
      scoreToAdd += pcBaseBonus + pcLineBonus;
      newB2B = true; 
    }

  } else { // ライン消去なしの場合
    newCombo = 0; 
    if (event.tSpinType === 'mini') { // ライン消去なし Mini T-Spin (Mini T-Spin No Lines)
        scoreToAdd += T_SPIN_SCORES.tSpinMini * newLevel;
        // B2Bは継続 (ラインを消していないため)
    }
  }
  
  return {
    score: currentScoreData.score + scoreToAdd,
    lines: newLines,
    level: newLevel,
    combo: newCombo,
    backToBack: newB2B,
    perfectClear: event.isPerfectClear, 
  };
} 