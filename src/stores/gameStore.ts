import { create } from 'zustand';
import type { GameState, TetrominoType, Tetromino, GameStatus, GameMode, GameSettings, Position, RotationState, TetrominoShape, TSpinType, Direction, CellType, GameBoard, ScoreData } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, DEFAULT_NEXT_PIECE_COUNT, DEFAULT_AUDIO_SETTINGS, HARD_DROP_SCORE, SOFT_DROP_SCORE } from '../constants/game';
import { INITIAL_ROTATION_STATE, TETROMINO_SHAPES } from '../constants/tetrominos';
import { createNewTetromino, getRotatedShapeAndPosition } from '../utils/tetromino';
import { getRandomTetrominoType } from '../utils/randomizer'; // 7-bagランダマイザ
import { checkCollision, checkTSpin, getHardDropPosition, checkLineClears, checkGameOver } from '../utils/gameLogic'; // 衝突判定とT-Spin判定
import { placePieceOnBoard, removeLinesAndShiftDown, isBoardEmpty } from '../utils/matrix';
import { updateScore } from '../utils/scoring';
// import { getRotatedShapeAndPosition } from '../utils/tetromino'; // 回転ロジック (後で使う)

// ゲームの初期状態生成関数
const createInitialBoard = (): GameBoard => Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill('empty'));

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
    sfxVolume: DEFAULT_AUDIO_SETTINGS.sfxVolume,
    musicVolume: DEFAULT_AUDIO_SETTINGS.musicVolume,
    muted: DEFAULT_AUDIO_SETTINGS.enabled,
  },
  dropTimer: 0,
  lockTimer: 0,
  linesClearedLastMove: 0,
  lastMoveWasRotation: false,
  tSpinType: 'none',
};

interface GameStoreActions {
  startGame: () => void;
  movePiece: (direction: Direction) => void;
  rotatePiece: (clockwise: boolean) => void;
  hardDrop: () => void;
  lockPieceAndSpawnNext: () => void;
  clearLinesAndUpdateScore: (clearedLines: number[]) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
}

interface GameStore extends GameStoreActions {
  state: GameState;
  setState: (partial: Partial<GameState> | ((state: GameState) => Partial<GameState>)) => void;
  reset: () => void;
  holdCurrentPiece: () => void;
  setTSpinResult: (tSpinType: TSpinType) => void;
  setLastMoveWasRotation: (wasRotation: boolean) => void;
  setPerfectClear: (isPerfectClear: boolean) => void;
  setBackToBack: (isB2B: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: initialState,
  setState: (partial) => set((store) => {
    const newStateSlice = typeof partial === 'function' ? partial(store.state) : partial;
    return { state: { ...store.state, ...newStateSlice } };
  }),
  reset: () => {
    const { setState } = get();
    const newNextPieces = Array.from({ length: initialState.settings.nextPieceCount }, () => createNewTetromino(initialState.boardWidth));
    setState(currentGlobalState => ({
        ...initialState,
        board: createInitialBoard(),
        nextPieces: newNextPieces,
        settings: currentGlobalState.settings,
    }));
  },

  // 新規アクションの雛形
  startGame: () => {
    const { state, setState } = get();
    const firstPieceType = getRandomTetrominoType();
    const firstPieceShape = getInitialShape(firstPieceType);
    const firstPiece: Tetromino = {
      type: firstPieceType,
      shape: firstPieceShape,
      position: { x: Math.floor((state.boardWidth - (firstPieceShape[0]?.length || 0)) / 2), y: 0 },
      rotation: INITIAL_ROTATION_STATE,
      lockDelay: state.settings.lockDelay,
    };

    const newNextPieces = Array.from({ length: state.settings.nextPieceCount }, () => createNewTetromino(state.boardWidth));

    setState((currentGlobalState) => ({
      ...initialState, 
      status: 'playing',
      board: createInitialBoard(),
      currentPiece: firstPiece,
      nextPieces: newNextPieces,
      holdPiece: null,
      canHold: true,
      startTime: Date.now(),
      settings: currentGlobalState.settings,
    }));
    // TODO: BGM再生開始
  },

  movePiece: (direction) => {
    const { state, setState } = get();
    if (state.status !== 'playing' || !state.currentPiece) return;

    const { currentPiece, board } = state;
    let newPosition = { ...currentPiece.position };

    if (direction === 'left') newPosition.x -= 1;
    else if (direction === 'right') newPosition.x += 1;
    else if (direction === 'down') newPosition.y += 1;

    if (!checkCollision(board, currentPiece.shape, newPosition)) {
      let scoreToAdd = 0;
      if (direction === 'down') {
        scoreToAdd = SOFT_DROP_SCORE; // ソフトドロップで1セルごとにスコア加算
      }
      setState(prev => ({
        currentPiece: prev.currentPiece ? { ...prev.currentPiece, position: newPosition } : null,
        lastMoveWasRotation: false,
        score: { ...prev.score, score: prev.score.score + scoreToAdd },
      }));
    } else if (direction === 'down') {
      // 下に移動しようとして衝突した場合、ロック処理を開始するなどのロジックをここに入れる (lockDelayなど)
      // 現時点では何もしない (ゲームループ側で落下とロックを管理する想定)
    }
  },

  rotatePiece: (clockwise) => {
    const { state, setState, setTSpinResult } = get();
    if (state.status !== 'playing' || !state.currentPiece) return;

    const { currentPiece, board } = state;
    const rotationResult = getRotatedShapeAndPosition(currentPiece, clockwise, board);

    if (rotationResult) {
      const { newShape, newPosition, newRotationState } = rotationResult;
      setState(prev => ({
        currentPiece: prev.currentPiece ? {
          ...prev.currentPiece,
          shape: newShape,
          position: newPosition,
          rotation: newRotationState,
        } : null,
        lastMoveWasRotation: true,
      }));
      // T-Spin判定: 回転成功後に、新しい状態で判定
      const tSpinType = checkTSpin(board, { ...currentPiece, shape: newShape, position: newPosition, rotation: newRotationState }, true);
      setTSpinResult(tSpinType);
    } else {
      // 回転失敗時は何もしないか、失敗音を鳴らすなど
    }
  },
  
  hardDrop: () => {
    const { state, setState, lockPieceAndSpawnNext } = get();
    if (state.status !== 'playing' || !state.currentPiece) return;

    const finalPosition = getHardDropPosition(state.board, state.currentPiece);
    const cellsDropped = finalPosition.y - state.currentPiece.position.y;

    setState(prev => ({
      currentPiece: prev.currentPiece ? { ...prev.currentPiece, position: finalPosition } : null,
      score: { ...prev.score, score: prev.score.score + (cellsDropped > 0 ? cellsDropped * HARD_DROP_SCORE : 0) },
    }));
    
    lockPieceAndSpawnNext(); 
  },

  lockPieceAndSpawnNext: () => {
    const { state, setState, clearLinesAndUpdateScore, gameOver, setTSpinResult } = get();
    if (!state.currentPiece) return;

    const newBoard = placePieceOnBoard(state.board, state.currentPiece);
    const clearedLines = checkLineClears(newBoard);

    if (clearedLines.length > 0) {
      clearLinesAndUpdateScore(clearedLines);
      // clearLinesAndUpdateScore内でPerfectClearも判定・セットされる想定
    } else if (state.tSpinType !== 'none') {
      // T-Spin No Lines (T-Spin Mini No Lines も含む)
      const newScoreData = updateScore(state.score, { linesCleared: 0, tSpinType: state.tSpinType, isPerfectClear: false });
      setState({ score: newScoreData });
    }
    setTSpinResult('none'); // T-Spin状態をリセット

    // 新しいピースをスポーン
    const nextPieceFromQueue = state.nextPieces[0];
    const newNextPieces = [...state.nextPieces.slice(1), createNewTetromino(state.boardWidth)];
    
    if (!nextPieceFromQueue) { // Nextピースがない異常系、ゲームオーバーに近いが一旦エラーとしておく
        console.error("Next piece is undefined in lockPieceAndSpawnNext");
        gameOver();
        return;
    }
    
    const newCurrentPiece: Tetromino = {
        ...nextPieceFromQueue,
        position: { x: Math.floor((state.boardWidth - (nextPieceFromQueue.shape[0]?.length || 0)) / 2), y: 0 },
        // rotation と lockDelay は nextPieceFromQueue (createNewTetromino由来) の値を使用
    };

    if (checkGameOver(newBoard, newCurrentPiece)) {
      setState({ board: newBoard, status: 'gameOver', endTime: Date.now(), currentPiece: null }); // ピースを固定してからゲームオーバー
      // gameOver(); // gameOverアクションは最終的な状態セットのみなので、ここでは直接状態を更新
    } else {
      setState({
        board: clearedLines.length > 0 ? removeLinesAndShiftDown(newBoard, clearedLines) : newBoard, // ライン消去後の盤面、またはそのままの盤面
        currentPiece: newCurrentPiece,
        nextPieces: newNextPieces,
        canHold: true,
      });
    }
  },

  clearLinesAndUpdateScore: (clearedLines) => {
    const { state, setState, setPerfectClear } = get();
    
    const boardAfterClear = removeLinesAndShiftDown(state.board, clearedLines); // 先に盤面からラインを消す
    const isPc = isBoardEmpty(boardAfterClear);
    if(isPc) {
        setPerfectClear(true); // ストアのperfectClearフラグを更新
    }

    const scoreUpdateEvent = {
        linesCleared: clearedLines.length,
        tSpinType: state.tSpinType, // T-Spin状態を渡す
        isPerfectClear: isPc,
    };
    const newScoreData = updateScore(state.score, scoreUpdateEvent);

    setState(prev => ({
      // board: boardAfterClear, // lockPieceAndSpawnNext で盤面更新するため、ここではスコア関連のみ
      score: newScoreData,
      linesClearedLastMove: clearedLines.length,
      // levelとcomboはnewScoreDataに含まれる
      // backToBackもnewScoreDataに含まれる
    }));
    // TODO: ライン消去エフェクト/サウンドトリガー
  },

  pauseGame: () => {
    const { state, setState } = get();
    if (state.status === 'playing') {
      setState({ status: 'paused' });
      // TODO: BGMポーズ
    }
  },
  resumeGame: () => {
    const { state, setState } = get();
    if (state.status === 'paused') {
      setState({ status: 'playing' });
      // TODO: BGM再開
    }
  },
  gameOver: () => {
    const { state, setState } = get();
    if (state.status !== 'gameOver') {
      // currentPiece が null でない場合、最後に盤面に固定する試み（オプション）
      let finalBoard = state.board;
      if (state.currentPiece) {
        finalBoard = placePieceOnBoard(state.board, state.currentPiece);
      }
      setState({ status: 'gameOver', endTime: Date.now(), board: finalBoard, currentPiece: null });
    }
  },

  // 既存のアクション
  holdCurrentPiece: () => {
    const { state, setState } = get();
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
        lockDelay: state.settings.lockDelay,
      };
    } else {
      const shiftedPieceDetails = newNextPieces.shift();
      if (shiftedPieceDetails) {
         // createNewTetromino は Tetromino を返すので、それをそのまま使う
        newCurrentPiece = {
            ...shiftedPieceDetails,
            position: { x: Math.floor((state.boardWidth - (shiftedPieceDetails.shape[0]?.length || 0)) / 2), y: 0 },
        };
      }
      newNextPieces.push(createNewTetromino(state.boardWidth));
    }
    
    const newHoldPieceShape = getInitialShape(pieceToHold.type);
    setState(store => ({
      currentPiece: newCurrentPiece,
      holdPiece: { 
        ...pieceToHold, 
        shape: newHoldPieceShape,
        rotation: INITIAL_ROTATION_STATE, 
        position: { 
          x: Math.floor((store.boardWidth - (newHoldPieceShape[0]?.length || 0)) / 2), 
          y: 0
        },
      },
      nextPieces: newNextPieces,
      canHold: false, 
    }));
  },
  setTSpinResult: (tSpinType) => get().setState({ tSpinType }),
  setLastMoveWasRotation: (wasRotation) => get().setState({ lastMoveWasRotation: wasRotation }),
  setPerfectClear: (isPerfectClear) => get().setState(prev => ({ 
    score: { ...prev.score, perfectClear: isPerfectClear }
  })),
  setBackToBack: (isB2B) => get().setState(prev => ({ 
    score: { ...prev.score, backToBack: isB2B }
  })),
})); 