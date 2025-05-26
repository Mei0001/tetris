import { create } from 'zustand';
import type { GameState, TetrominoType, Tetromino, GameStatus, GameMode, GameSettings, Position, RotationState, TetrominoShape, TSpinType } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, DEFAULT_NEXT_PIECE_COUNT } from '../constants/game';
import { INITIAL_ROTATION_STATE, TETROMINO_SHAPES } from '../constants/tetrominos';
import { createNewTetromino } from '../utils/tetromino';

// ゲームの初期状態生成関数
const createInitialBoard = () => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill('empty'));

// ユーティリティ：指定タイプのテトロミノの初期形状を取得
const getInitialShape = (type: TetrominoType): TetrominoShape => TETROMINO_SHAPES[type][INITIAL_ROTATION_STATE];

const initialState: GameState = {
  status: 'ready',
  mode: 'classic',
  startTime: 0,
  endTime: undefined,
  board: createInitialBoard(),
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  currentPiece: null,
  nextPieces: Array.from({ length: DEFAULT_NEXT_PIECE_COUNT }, () => createNewTetromino(BOARD_WIDTH)),
  holdPiece: null,
  canHold: true,
  score: {
    score: 0,
    lines: 0,
    level: 1,
    combo: 0,
    backToBack: false,
    perfectClear: false,
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
  tSpinType: 'none',
};

interface GameStore {
  state: GameState;
  setState: (partial: Partial<GameState> | ((state: GameState) => Partial<GameState>)) => void;
  reset: () => void;
  holdCurrentPiece: () => void;
  setTSpinResult: (tSpinType: TSpinType) => void;
  setLastMoveWasRotation: (wasRotation: boolean) => void;
  setPerfectClear: (isPerfectClear: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: initialState,
  setState: (partial) => set((store) => ({ state: typeof partial === 'function' ? { ...store.state, ...partial(store.state) } : { ...store.state, ...partial }})),
  reset: () => set({ state: { ...initialState, board: createInitialBoard(), nextPieces: Array.from({ length: DEFAULT_NEXT_PIECE_COUNT }, () => createNewTetromino(BOARD_WIDTH)) } }),
  holdCurrentPiece: () => {
    const { state } = get();
    if (!state.settings.holdEnabled || !state.canHold || !state.currentPiece) return;

    const pieceToHold: Tetromino = state.currentPiece;
    let newCurrentPiece: Tetromino | null = null;
    let newNextPieces = [...state.nextPieces];

    if (state.holdPiece) {
      const heldPiece = state.holdPiece;
      const initialHeldShape = getInitialShape(heldPiece.type);
      newCurrentPiece = { 
        ...heldPiece,
        shape: initialHeldShape,
        position: { x: Math.floor((state.boardWidth - (initialHeldShape[0]?.length || 0)) / 2), y: 0 },
        rotation: INITIAL_ROTATION_STATE,
      };
    } else {
      const shiftedPiece = newNextPieces.shift();
      if (shiftedPiece) {
        const initialShiftedShape = getInitialShape(shiftedPiece.type);
        newCurrentPiece = {
          ...shiftedPiece,
          shape: initialShiftedShape,
          position: { x: Math.floor((state.boardWidth - (initialShiftedShape[0]?.length || 0)) / 2), y: 0 },
          rotation: INITIAL_ROTATION_STATE,
        };
      }
      newNextPieces.push(createNewTetromino(state.boardWidth));
    }
    
    const newHoldPieceShape = getInitialShape(pieceToHold.type);
    set((store) => ({
      state: {
        ...store.state,
        currentPiece: newCurrentPiece,
        holdPiece: { 
          ...pieceToHold, 
          shape: newHoldPieceShape,
          position: {x:0, y:0}, 
          rotation: INITIAL_ROTATION_STATE, 
        },
        nextPieces: newNextPieces,
        canHold: false, 
      }
    }));
  },
  setTSpinResult: (tSpinType) => set((store) => ({ state: { ...store.state, tSpinType }})),
  setLastMoveWasRotation: (wasRotation) => set((store) => ({ state: { ...store.state, lastMoveWasRotation: wasRotation }})),
  setPerfectClear: (isPerfectClear) => set((store) => ({ 
    state: { 
      ...store.state, 
      score: { ...store.state.score, perfectClear: isPerfectClear }
    }
  })),
})); 