import { create } from 'zustand';
import type { GameState, TetrominoType, Tetromino, GameStatus, GameMode, GameSettings } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, DEFAULT_NEXT_PIECE_COUNT } from '../constants/game';

// ゲームの初期状態生成関数
const createInitialBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill('empty'));

const initialState: GameState = {
  status: 'ready',
  mode: 'classic',
  startTime: 0,
  endTime: undefined,
  board: createInitialBoard(),
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  currentPiece: null,
  nextPieces: [],
  holdPiece: null,
  canHold: true,
  score: {
    score: 0,
    lines: 0,
    level: 1,
    combo: 0,
    backToBack: false,
  },
  settings: {
    autoRepeatDelay: 170,
    autoRepeatRate: 0,
    softDropRate: 20,
    lockDelay: 500,
    ghostPiece: true,
    holdEnabled: true,
    nextPieceCount: DEFAULT_NEXT_PIECE_COUNT,
  },
  dropTimer: 0,
  lockTimer: 0,
  linesClearedLastMove: 0,
  lastMoveWasRotation: false,
  tSpinType: undefined,
};

interface GameStore {
  state: GameState;
  setState: (partial: Partial<GameState>) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  state: initialState,
  setState: (partial) => set((store) => ({ state: { ...store.state, ...partial } })),
  // ボードを含む全状態を初期化
  reset: () => set({ state: { ...initialState, board: createInitialBoard() } }),
})); 