// ==============================
// 基本型定義
// ==============================

/** 座標位置 */
export interface Position {
  x: number;
  y: number;
}

/** ゲームボードのセル状態 */
export type CellType = 
  | 'empty'        // 空のセル
  | 'filled'       // 埋まっているセル
  | 'ghost'        // ゴーストピース
  | 'active';      // アクティブピース

/** テトロミノの種類 */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** 回転状態 */
export type RotationState = 0 | 1 | 2 | 3;

/** 移動方向 */
export type Direction = 'left' | 'right' | 'down';

/** ゲーム状態 */
export type GameStatus = 
  | 'ready'        // ゲーム準備中
  | 'playing'      // ゲーム中
  | 'paused'       // 一時停止
  | 'gameOver'     // ゲームオーバー
  | 'completed';   // ゲーム完了

/** ゲームモード */
export type GameMode = 
  | 'classic'      // クラシックモード
  | 'sprint'       // スプリントモード（40ライン）
  | 'zen'          // 禅モード（無限）
  | 'challenge';   // チャレンジモード

// ==============================
// ゲームオブジェクト型定義
// ==============================

/** テトロミノ形状データ (パターンのみ) */
export type TetrominoShape = boolean[][];

/** テトロミノオブジェクト */
export interface Tetromino {
  type: TetrominoType;
  position: Position;
  rotation: RotationState;
  shape: TetrominoShape;
  lockDelay: number;
}

/** ゲームボード */
export type GameBoard = CellType[][];

/** ボードのセル情報 */
export interface BoardCell {
  type: CellType;
  color?: string;
  tetrominoType?: TetrominoType;
}

// ==============================
// ゲーム状態型定義
// ==============================

/** スコア情報 */
export interface ScoreData {
  score: number;
  lines: number;
  level: number;
  combo: number;
  backToBack: boolean;
  perfectClear?: boolean;
  time?: number;
}

/** 統計情報 */
export interface GameStatistics {
  totalGames: number;
  totalLines: number;
  totalTime: number;
  bestScore: number;
  bestTime: number;
  averageScore: number;
  tetrominoCount: Record<TetrominoType, number>;
}

/** ゲーム設定 */
export interface GameSettings {
  autoRepeatDelay: number;    // ARD - 自動リピート遅延
  autoRepeatRate: number;     // ARR - 自動リピート速度
  softDropRate: number;       // ソフトドロップ速度
  lockDelay: number;          // ロック遅延
  ghostPiece: boolean;        // ゴーストピース表示
  holdEnabled: boolean;       // ホールド機能
  nextPieceCount: number;     // 次のピース表示数
  sfxVolume: number;          // 効果音ボリューム
  musicVolume: number;        // BGMボリューム
  muted: boolean;             // ミュート状態
}

/** メインゲーム状態 */
export interface GameState {
  // ゲーム基本情報
  status: GameStatus;
  mode: GameMode;
  startTime: number;
  endTime?: number;
  elapsedTime?: number;
  
  // ボード状態
  board: GameBoard;
  boardWidth: number;
  boardHeight: number;
  
  // ピース情報
  currentPiece: Tetromino | null;
  nextPieces: Tetromino[];
  holdPiece: Tetromino | null;
  canHold: boolean;
  
  // スコア・レベル
  score: ScoreData;
  
  // Sprint Mode用
  sprintLinesGoal?: number;
  sprintLinesCleared?: number;
  
  // ゲーム設定
  settings: GameSettings;
  
  // ゲームフロー
  dropTimer: number;
  lockTimer: number;
  linesClearedLastMove: number;
  
  // T-Spin判定用
  lastMoveWasRotation: boolean;
  tSpinType: TSpinType;
}

// ==============================
// UI関連型定義
// ==============================

/** ボタンのサイズ */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** ボタンのバリアント */
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'ghost';

/** モーダルのサイズ */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

/** アニメーション設定 */
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

// ==============================
// イベント型定義
// ==============================

/** キーボードアクション */
export type KeyboardAction = 
  | 'moveLeft'
  | 'moveRight'
  | 'softDrop'
  | 'hardDrop'
  | 'rotateClockwise'
  | 'rotateCounterclockwise'
  | 'hold'
  | 'pause'
  | 'restart';

/** ゲームイベント */
export interface GameEvent {
  type: string;
  timestamp: number;
  data?: any;
}

/** オーディオ設定 */
export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enabled: boolean;
}

// ==============================
// エクスポート
// ==============================

// ゲーム関連型の再エクスポート
// export type {
//   GameActionType,
//   GameAction,
//   LineClearType,
//   LineClearInfo,
//   TimerConfig,
//   TimerState,
//   GameLoopState,
//   FrameTiming,
//   PerformanceMetrics,
//   DebugInfo,
//   SaveData,
//   PlayerInfo,
//   RoomInfo,
// } from './game';

// テトロミノ関連型の再エクスポート
// export type {
//   TetrominoPatterns,
//   TetrominoColors,
//   KickTable,
//   TetrominoProperties,
//   MoveType,
//   RotationType,
//   MoveRequest,
//   RotationRequest,
//   MoveResult,
//   SevenBagState,
//   GeneratorConfig,
//   LockDelayState,
//   LockDelayResetCondition,
//   TSpinResult,
//   TSpinValidation,
//   TetrominoAnimation,
//   GhostPieceConfig,
// } from './tetromino';

// UI関連型の再エクスポート
// export type {
//   ThemeType,
//   ColorScheme,
//   Theme,
//   BaseComponentProps,
//   ButtonProps,
//   ModalProps,
//   Breakpoint,
//   GridConfig,
//   FlexConfig,
//   GamePanelType,
//   GamePanelConfig,
//   HUDConfig,
//   KeyBinding,
//   TouchGesture,
//   TouchConfig,
//   AnimationType,
//   AnimationSettings,
//   NotificationType,
//   NotificationConfig,
//   TooltipPosition,
//   TooltipProps,
//   MenuItem,
//   MenuConfig,
// } from './ui'; 

// T-Spinの種類
export type TSpinType = 'none' | 'mini' | 'regular';