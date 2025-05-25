import type { 
  Position, 
  TetrominoType, 
  GameMode, 
  GameStatus,
  ScoreData,
  GameSettings
} from './index';

// ==============================
// ゲームアクション型定義
// ==============================

/** ゲームアクションタイプ */
export type GameActionType =
  | 'INIT_GAME'
  | 'START_GAME'
  | 'PAUSE_GAME'
  | 'RESUME_GAME'
  | 'END_GAME'
  | 'RESTART_GAME'
  | 'UPDATE_SCORE'
  | 'LEVEL_UP'
  | 'CLEAR_LINES'
  | 'SPAWN_PIECE'
  | 'MOVE_PIECE'
  | 'ROTATE_PIECE'
  | 'DROP_PIECE'
  | 'LOCK_PIECE'
  | 'HOLD_PIECE';

/** ゲームアクション */
export interface GameAction {
  type: GameActionType;
  payload?: any;
  timestamp: number;
}

// ==============================
// ライン消去関連
// ==============================

/** ライン消去タイプ */
export type LineClearType = 
  | 'single'    // 1ライン
  | 'double'    // 2ライン  
  | 'triple'    // 3ライン
  | 'tetris'    // 4ライン
  | 'tSpin'     // T-Spin
  | 'tSpinMini' // T-Spin Mini
  | 'perfectClear'; // Perfect Clear

/** ライン消去情報 */
export interface LineClearInfo {
  type: LineClearType;
  linesCleared: number;
  clearedRows: number[];
  score: number;
  isBackToBack: boolean;
  comboCount: number;
}

// ==============================
// ゲームタイマー関連
// ==============================

/** タイマー設定 */
export interface TimerConfig {
  interval: number;
  autoStart: boolean;
  precision: number;
}

/** タイマー状態 */
export interface TimerState {
  isRunning: boolean;
  startTime: number;
  pausedTime: number;
  totalPausedTime: number;
  currentTime: number;
}

// ==============================
// ゲームループ関連
// ==============================

/** ゲームループ状態 */
export interface GameLoopState {
  isRunning: boolean;
  frameCount: number;
  lastFrameTime: number;
  targetFPS: number;
  actualFPS: number;
  deltaTime: number;
}

/** フレームタイミング */
export interface FrameTiming {
  timestamp: number;
  deltaTime: number;
  frameRate: number;
}

// ==============================
// パフォーマンス関連
// ==============================

/** パフォーマンス計測 */
export interface PerformanceMetrics {
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  memoryUsage: number;
  renderTime: number;
}

// ==============================
// デバッグ関連
// ==============================

/** デバッグ情報 */
export interface DebugInfo {
  gameState: Partial<GameMode>;
  performance: PerformanceMetrics;
  lastActions: GameAction[];
  boardHash: string;
  version: string;
}

// ==============================
// セーブデータ関連
// ==============================

/** セーブデータ */
export interface SaveData {
  version: string;
  gameState: {
    mode: GameMode;
    status: GameStatus;
    score: ScoreData;
    settings: GameSettings;
    board: string; // シリアライズされたボード
    currentPiece: string | null; // シリアライズされたピース
    nextPieces: TetrominoType[];
    holdPiece: TetrominoType | null;
  };
  metadata: {
    saveTime: number;
    gameTime: number;
    platform: string;
  };
}

// ==============================
// マルチプレイヤー関連（将来拡張用）
// ==============================

/** プレイヤー情報 */
export interface PlayerInfo {
  id: string;
  name: string;
  avatar?: string;
  isReady: boolean;
  isConnected: boolean;
}

/** ルーム情報 */
export interface RoomInfo {
  id: string;
  name: string;
  players: PlayerInfo[];
  maxPlayers: number;
  gameMode: GameMode;
  isStarted: boolean;
}

// エクスポートは既に各型定義で行われているため、
// 重複するエクスポート宣言は不要 