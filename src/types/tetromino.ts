import type { Position, TetrominoType, RotationState } from './index';

// ==============================
// テトロミノ形状関連
// ==============================

/** テトロミノの形状パターン（回転状態別） */
export type TetrominoPatterns = {
  [K in TetrominoType]: {
    [R in RotationState]: boolean[][];
  };
};

/** テトロミノのカラー定義 */
export type TetrominoColors = {
  [K in TetrominoType]: string;
};

/** キックテーブル（SRS回転システム用） */
export interface KickTable {
  from: RotationState;
  to: RotationState;
  offsets: Position[];
}

/** テトロミノの基本プロパティ */
export interface TetrominoProperties {
  name: TetrominoType;
  color: string;
  patterns: { [R in RotationState]: boolean[][] };
  spawnOffset: Position;
  kickTables: KickTable[];
}

// ==============================
// テトロミノ操作関連
// ==============================

/** 移動タイプ */
export type MoveType = 'left' | 'right' | 'down' | 'drop';

/** 回転タイプ */
export type RotationType = 'clockwise' | 'counterclockwise' | '180';

/** テトロミノの移動リクエスト */
export interface MoveRequest {
  type: MoveType;
  position: Position;
  force?: boolean; // 強制移動（デバッグ用）
}

/** テトロミノの回転リクエスト */
export interface RotationRequest {
  type: RotationType;
  currentRotation: RotationState;
  position: Position;
  useKicks?: boolean; // ウォールキック使用
}

/** 移動・回転の結果 */
export interface MoveResult {
  success: boolean;
  newPosition: Position;
  newRotation?: RotationState;
  kickUsed?: Position; // 使用されたキック
  reason?: string; // 失敗理由
}

// ==============================
// テトロミノジェネレーター関連
// ==============================

/** 7-bagアルゴリズムの状態 */
export interface SevenBagState {
  currentBag: TetrominoType[];
  nextBag: TetrominoType[];
  position: number;
}

/** テトロミノジェネレーターの設定 */
export interface GeneratorConfig {
  algorithm: '7bag' | 'random' | 'custom';
  seed?: number;
  customSequence?: TetrominoType[];
  previewCount: number;
}

// ==============================
// ロック遅延関連
// ==============================

/** ロック遅延の状態 */
export interface LockDelayState {
  timer: number;
  maxDelay: number;
  moveCount: number;
  rotationCount: number;
  maxMoves: number;
  maxRotations: number;
  isActive: boolean;
}

/** ロック遅延のリセット条件 */
export type LockDelayResetCondition = 
  | 'move'
  | 'rotation'
  | 'drop'
  | 'none';

// ==============================
// T-Spin関連
// ==============================

/** T-Spinの判定結果 */
export interface TSpinResult {
  isTSpin: boolean;
  isMinimal: boolean;
  corners: boolean[]; // 4つの角の占有状態
  type: 'none' | 'mini' | 'regular';
}

/** T-Spinの検証データ */
export interface TSpinValidation {
  position: Position;
  rotation: RotationState;
  previousRotation: RotationState;
  lastMoveWasRotation: boolean;
  board: boolean[][];
}

// ==============================
// テトロミノアニメーション関連
// ==============================

/** アニメーション状態 */
export interface TetrominoAnimation {
  type: 'fall' | 'lock' | 'clear' | 'spawn';
  duration: number;
  startTime: number;
  progress: number;
  easing: string;
}

/** ゴーストピース設定 */
export interface GhostPieceConfig {
  enabled: boolean;
  opacity: number;
  color: string;
  style: 'outline' | 'filled' | 'dashed';
} 