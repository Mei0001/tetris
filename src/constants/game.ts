import type { Position, CellType, TetrominoType, GameStatus, GameMode, GameSettings, RotationState } from '../types';

// ==============================
// ゲームボード定数
// ==============================

/** ゲームボードの幅（標準Tetris） */
export const BOARD_WIDTH = 10;

/** ゲームボードの高さ（標準Tetris） */
export const BOARD_HEIGHT = 20;

/** バッファゾーンの高さ（スポーン用の見えない領域） */
export const BUFFER_ZONE_HEIGHT = 4;

/** 実際のボードの高さ（バッファゾーン含む） */
export const TOTAL_BOARD_HEIGHT = BOARD_HEIGHT + BUFFER_ZONE_HEIGHT;

/** テトロミノのスポーン位置 */
export const SPAWN_POSITION = {
  x: Math.floor(BOARD_WIDTH / 2) - 1, // 中央よりやや左
  y: BOARD_HEIGHT + 1, // バッファゾーン内
} as const;

// ==============================
// ゲームタイミング定数
// ==============================

/** フレームレート（FPS） */
export const TARGET_FPS = 60;

/** フレーム間隔（ミリ秒） */
export const FRAME_INTERVAL = 1000 / TARGET_FPS;

/** 基本落下速度（ミリ秒）- レベル1 */
export const BASE_FALL_SPEED = 1000;

/** ソフトドロップ速度倍率 */
export const SOFT_DROP_MULTIPLIER = 20;

/** ロック遅延（ミリ秒） */
export const LOCK_DELAY = 500;

/** 最大ロック遅延リセット回数 */
export const MAX_LOCK_RESETS = 15;

/** DAS（Delayed Auto Shift）遅延（ミリ秒） */
export const DAS_DELAY = 170;

/** ARR（Auto Repeat Rate）間隔（ミリ秒） */
export const ARR_INTERVAL = 0;

// ==============================
// スコアリング定数
// ==============================

/** ライン消去スコア */
export const LINE_CLEAR_SCORES = {
  single: 100,
  double: 300,
  triple: 500,
  tetris: 800,
} as const;

/** T-Spinスコア */
export const T_SPIN_SCORES = {
  tSpinMini: 100,
  tSpinMiniSingle: 200,
  tSpinSingle: 800,
  tSpinMiniDouble: 1200,
  tSpinDouble: 1200,
  tSpinTriple: 1600,
} as const;

/** Perfect Clearボーナス */
export const PERFECT_CLEAR_BONUS = 1000;

/** ソフトドロップポイント（1セルあたり） */
export const SOFT_DROP_SCORE = 1;

/** ハードドロップポイント（1セルあたり） */
export const HARD_DROP_SCORE = 2;

/** Back-to-Backボーナス倍率 */
export const BACK_TO_BACK_MULTIPLIER = 1.5;

/** コンボベーススコア */
export const COMBO_BASE_SCORE = 50;

// ==============================
// レベル進行定数
// ==============================

/** レベルアップに必要なライン数 */
export const LINES_PER_LEVEL = 10;

/** 最大レベル */
export const MAX_LEVEL = 20;

/** レベル別落下速度（フレーム数） */
export const LEVEL_SPEEDS = [
  48, 43, 38, 33, 28, 23, 18, 13, 8, 6,  // レベル 1-10
  5, 5, 5, 4, 4, 4, 3, 3, 3, 2,        // レベル 11-20
] as const;

// ==============================
// ゲームモード設定
// ==============================

/** スプリントモードの目標ライン数 */
export const SPRINT_TARGET_LINES = 40;

/** チャレンジモードの時間制限（ミリ秒） */
export const CHALLENGE_TIME_LIMIT = 180000; // 3分

/** 禅モードの最大ライン数（無制限の場合はnull） */
export const ZEN_MAX_LINES = null;

// ==============================
// UI/UX定数
// ==============================

/** ネクストピースの表示数 */
export const DEFAULT_NEXT_PIECE_COUNT = 5;

/** アニメーション持続時間（ミリ秒） */
export const ANIMATION_DURATIONS = {
  lineClear: 500,
  pieceLock: 200,
  gameOver: 1000,
  levelUp: 800,
  spawn: 300,
} as const;

/** ネオンエフェクトの色 */
export const NEON_COLORS = {
  cyan: '#00FFFF',
  purple: '#FF00FF',
  blue: '#0080FF',
  green: '#00FF80',
  yellow: '#FFFF00',
  red: '#FF0040',
  orange: '#FF8000',
} as const;

/** 初期回転状態 */
export const INITIAL_ROTATION_STATE: RotationState = 0;

// ==============================
// キーマッピング定数
// ==============================

/** デフォルトキーバインド */
export const DEFAULT_KEY_BINDINGS = {
  moveLeft: ['ArrowLeft', 'KeyA'],
  moveRight: ['ArrowRight', 'KeyD'],
  softDrop: ['ArrowDown', 'KeyS'],
  hardDrop: ['Space'],
  rotateClockwise: ['ArrowUp', 'KeyX', 'KeyK'],
  rotateCounterclockwise: ['ControlLeft', 'KeyZ', 'KeyJ'],
  hold: ['KeyC', 'ShiftLeft'],
  pause: ['Escape', 'KeyP'],
  restart: ['KeyR'],
} as const;

// ==============================
// 音響設定定数
// ==============================

/** デフォルト音量設定 */
export const DEFAULT_AUDIO_SETTINGS = {
  masterVolume: 0.7,
  sfxVolume: 0.8,
  musicVolume: 0.6,
  enabled: true,
} as const;

/** 音響効果の種類 */
export const SOUND_EFFECTS = {
  move: 'move',
  rotate: 'rotate',
  softDrop: 'softDrop',
  hardDrop: 'hardDrop',
  lineClear: 'lineClear',
  tetris: 'tetris',
  tSpin: 'tSpin',
  hold: 'hold',
  levelUp: 'levelUp',
  gameOver: 'gameOver',
  perfectClear: 'perfectClear',
  combo: 'combo',
} as const;

// ==============================
// パフォーマンス定数
// ==============================

/** レンダリング最適化の閾値 */
export const PERFORMANCE_THRESHOLDS = {
  lowFPS: 30,
  goodFPS: 55,
  targetFPS: 60,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
} as const;

/** デバッグモードの設定 */
export const DEBUG_CONFIG = {
  showFPS: false,
  showPerformanceMetrics: false,
  logGameActions: false,
  showHitboxes: false,
  enableGodMode: false,
} as const;

// ==============================
// セーブデータ定数
// ==============================

/** セーブデータのバージョン */
export const SAVE_DATA_VERSION = '1.0.0';

/** ローカルストレージのキー */
export const STORAGE_KEYS = {
  gameState: 'tetris_game_state',
  settings: 'tetris_settings',
  statistics: 'tetris_statistics',
  highScores: 'tetris_high_scores',
  keyBindings: 'tetris_key_bindings',
} as const;

// ==============================
// エラーメッセージ定数
// ==============================

/** ゲームエラーメッセージ */
export const ERROR_MESSAGES = {
  invalidMove: 'Invalid move attempted',
  invalidRotation: 'Invalid rotation attempted',
  gameNotStarted: 'Game has not been started',
  gameAlreadyStarted: 'Game is already in progress',
  saveDataCorrupted: 'Save data is corrupted',
  unsupportedBrowser: 'Browser not supported',
} as const;

// ==============================
// ブレークポイント定数
// ==============================

/** レスポンシブデザインのブレークポイント */
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ==============================
// 型エクスポート（型安全性のため）
// ==============================

export type LineClearType = keyof typeof LINE_CLEAR_SCORES;
export type TSPinType = keyof typeof T_SPIN_SCORES;
export type SoundEffectType = keyof typeof SOUND_EFFECTS;
export type StorageKey = keyof typeof STORAGE_KEYS; 