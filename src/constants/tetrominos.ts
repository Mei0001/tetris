import type { TetrominoType, RotationState, Position, TetrominoPatterns, TetrominoColors } from '../types';

// ==============================
// テトロミノカラー定義
// ==============================

/** 各テトロノの標準色（現代Tetrisガイドライン準拠） */
export const TETROMINO_COLORS: TetrominoColors = {
  I: '#00FFFF', // シアン
  O: '#FFFF00', // イエロー  
  T: '#800080', // パープル
  S: '#00FF00', // グリーン
  Z: '#FF0000', // レッド
  J: '#0000FF', // ブルー
  L: '#FFA500', // オレンジ
} as const;

// ==============================
// テトロミノ形状パターン（SRS準拠）
// ==============================

/** 
 * テトロミノの形状パターン
 * 各回転状態（0,1,2,3）での4x4グリッド内の形状
 * true = ブロックあり, false = 空
 */
export const TETROMINO_PATTERNS: TetrominoPatterns = {
  // I-piece（直線）
  I: {
    0: [
      [false, false, false, false],
      [true,  true,  true,  true ],
      [false, false, false, false],
      [false, false, false, false],
    ],
    1: [
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
      [false, false, true,  false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  true ],
      [false, false, false, false],
    ],
    3: [
      [false, true,  false, false],
      [false, true,  false, false],
      [false, true,  false, false],
      [false, true,  false, false],
    ],
  },

  // O-piece（正方形）
  O: {
    0: [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    2: [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    3: [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
  },

  // T-piece（T字）
  T: {
    0: [
      [false, false, false, false],
      [false, true,  false, false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
      [false, true,  false, false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [false, true,  false, false],
    ],
    3: [
      [false, false, false, false],
      [false, true,  false, false],
      [true,  true,  false, false],
      [false, true,  false, false],
    ],
  },

  // S-piece（逆Z字）
  S: {
    0: [
      [false, false, false, false],
      [false, true,  true,  false],
      [true,  true,  false, false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
      [false, false, true,  false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [false, true,  true,  false],
      [true,  true,  false, false],
    ],
    3: [
      [false, false, false, false],
      [true,  false, false, false],
      [true,  true,  false, false],
      [false, true,  false, false],
    ],
  },

  // Z-piece（Z字）
  Z: {
    0: [
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  true,  false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, false, true,  false],
      [false, true,  true,  false],
      [false, true,  false, false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  true,  false],
    ],
    3: [
      [false, false, false, false],
      [false, true,  false, false],
      [true,  true,  false, false],
      [true,  false, false, false],
    ],
  },

  // J-piece（逆L字）
  J: {
    0: [
      [false, false, false, false],
      [true,  false, false, false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, true,  true,  false],
      [false, true,  false, false],
      [false, true,  false, false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [false, false, true,  false],
    ],
    3: [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  false, false],
      [true,  true,  false, false],
    ],
  },

  // L-piece（L字）
  L: {
    0: [
      [false, false, false, false],
      [false, false, true,  false],
      [true,  true,  true,  false],
      [false, false, false, false],
    ],
    1: [
      [false, false, false, false],
      [false, true,  false, false],
      [false, true,  false, false],
      [false, true,  true,  false],
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true,  true,  true,  false],
      [true,  false, false, false],
    ],
    3: [
      [false, false, false, false],
      [true,  true,  false, false],
      [false, true,  false, false],
      [false, true,  false, false],
    ],
  ],
} as const;

// ==============================
// SRS ウォールキックデータ
// ==============================

/** 
 * SRS（Super Rotation System）ウォールキックテーブル
 * JLSTZ pieces用の標準キックデータ
 */
export const SRS_WALL_KICKS_JLSTZ = {
  '0_1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '1_0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '1_2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  '2_1': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  '2_3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  '3_2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '3_0': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  '0_3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
} as const;

/** 
 * I-piece用の特別なキックデータ
 * I-pieceは他のピースとは異なるキックパターンを使用
 */
export const SRS_WALL_KICKS_I = {
  '0_1': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  '1_0': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  '1_2': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
  '2_1': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  '2_3': [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  '3_2': [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  '3_0': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  '0_3': [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
} as const;

// ==============================
// テトロミノ基本プロパティ
// ==============================

/** 各テトロミノのスポーンオフセット */
export const SPAWN_OFFSETS: Record<TetrominoType, Position> = {
  I: { x: 0, y: 0 },
  O: { x: 0, y: 0 },
  T: { x: 0, y: 0 },
  S: { x: 0, y: 0 },
  Z: { x: 0, y: 0 },
  J: { x: 0, y: 0 },
  L: { x: 0, y: 0 },
} as const;

/** テトロミノの7-bagシーケンス */
export const TETROMINO_TYPES: readonly TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

// ==============================
// ヘルパー関数
// ==============================

/**
 * テトロミノタイプからキックテーブルを取得
 */
export function getWallKickData(type: TetrominoType) {
  return type === 'I' ? SRS_WALL_KICKS_I : SRS_WALL_KICKS_JLSTZ;
}

/**
 * 回転状態から次の回転状態を取得
 */
export function getNextRotation(current: RotationState, clockwise: boolean = true): RotationState {
  if (clockwise) {
    return ((current + 1) % 4) as RotationState;
  } else {
    return ((current + 3) % 4) as RotationState;
  }
}

/**
 * テトロミノの形状パターンを取得
 */
export function getTetrominoPattern(type: TetrominoType, rotation: RotationState): boolean[][] {
  return TETROMINO_PATTERNS[type][rotation];
}

/**
 * テトロミノの色を取得
 */
export function getTetrominoColor(type: TetrominoType): string {
  return TETROMINO_COLORS[type];
}

/**
 * パターンからブロック位置の配列を取得
 */
export function getBlockPositions(pattern: boolean[][]): Position[] {
  const positions: Position[] = [];
  
  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      if (pattern[y][x]) {
        positions.push({ x, y });
      }
    }
  }
  
  return positions;
}

/**
 * テトロミノの境界ボックスを計算
 */
export function getBoundingBox(pattern: boolean[][]) {
  let minX = pattern[0].length;
  let maxX = -1;
  let minY = pattern.length;
  let maxY = -1;

  for (let y = 0; y < pattern.length; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      if (pattern[y][x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

// ==============================
// 7-Bag ランダマイザー
// ==============================

/**
 * 7-bagアルゴリズムで次のテトロミノシーケンスを生成
 */
export function generateSevenBag(): TetrominoType[] {
  const bag = [...TETROMINO_TYPES];
  
  // Fisher-Yates shuffle
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  
  return bag;
} 