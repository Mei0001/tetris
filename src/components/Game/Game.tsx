import React, { useEffect, useRef, useCallback, Suspense } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useKeyboard, type KeyboardAction } from '../../hooks/useKeyboard';
import { LEVEL_SPEEDS, FRAME_INTERVAL } from '../../constants/game';
import Board from '../Board/Board';
import ScorePanel from '../UI/ScorePanel';
import NextPanel from '../UI/NextPanel';
import ModeSelect from '../UI/ModeSelect';
import StatisticsPanel from '../UI/StatisticsPanel';

// 仮のプレースホルダーコンポーネント
// const BoardPlaceholder: React.FC = () => <div className="w-64 h-[480px] bg-gray-700 flex items-center justify-center text-white">Board Area</div>;
const ScorePanelPlaceholder: React.FC = () => <div className="w-32 h-20 bg-gray-600 flex items-center justify-center text-white">Score</div>;
const NextPanelPlaceholder: React.FC = () => <div className="w-32 h-40 bg-gray-600 flex items-center justify-center text-white">Next</div>;
const HoldPanel = React.lazy(() => import('../UI/HoldPanel'));

const Game: React.FC = () => {
  const gameState = useGameStore((s) => s.state);
  const {
    startGame,
    movePiece,
    rotatePiece,
    hardDrop,
    holdCurrentPiece,
    pauseGame,
    resumeGame,
  } = useGameStore((s) => ({
    startGame: s.startGame,
    movePiece: s.movePiece,
    rotatePiece: s.rotatePiece,
    hardDrop: s.hardDrop,
    holdCurrentPiece: s.holdCurrentPiece,
    pauseGame: s.pauseGame,
    resumeGame: s.resumeGame,
  }));

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const fallAccumulatorRef = useRef<number>(0);
  const setMode = useGameStore((s) => s.setState);

  const handleKeyboardAction = useCallback(
    (action: KeyboardAction) => {
      if (gameState.status === 'ready' && action === 'hardDrop') {
        startGame();
        return;
      }
      if (gameState.status === 'gameOver' && action === 'hardDrop') {
        startGame(); // ゲームオーバー時もスペースでリスタート
        return;
      }
      if (gameState.status !== 'playing') {
        if (gameState.status === 'paused' && action === 'pause') resumeGame();
        return;
      }

      switch (action) {
        case 'moveLeft':
          movePiece('left');
          break;
        case 'moveRight':
          movePiece('right');
          break;
        case 'softDrop':
          movePiece('down');
          break;
        case 'hardDrop':
          hardDrop();
          break;
        case 'rotateClockwise':
          rotatePiece(true);
          break;
        case 'rotateCounterclockwise':
          rotatePiece(false);
          break;
        case 'hold':
          holdCurrentPiece();
          break;
        case 'pause':
          pauseGame();
          break;
        default:
          break;
      }
    },
    [gameState.status, startGame, movePiece, rotatePiece, hardDrop, holdCurrentPiece, pauseGame, resumeGame]
  );

  useKeyboard({ onAction: handleKeyboardAction });

  const gameTick = useCallback(
    (timestamp: number) => {
      if (gameState.status !== 'playing') {
        lastUpdateTimeRef.current = timestamp; // 停止中も時間は更新
        gameLoopRef.current = requestAnimationFrame(gameTick);
        return;
      }

      const deltaTime = timestamp - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = timestamp;
      fallAccumulatorRef.current += deltaTime;

      const currentLevel = Math.min(gameState.score.level, LEVEL_SPEEDS.length);
      const fallInterval = LEVEL_SPEEDS[currentLevel - 1] * FRAME_INTERVAL;

      if (fallAccumulatorRef.current >= fallInterval) {
        movePiece('down'); // 自動落下
        fallAccumulatorRef.current = 0;
      }

      gameLoopRef.current = requestAnimationFrame(gameTick);
    },
    [gameState.status, gameState.score.level, movePiece]
  );

  useEffect(() => {
    if (gameState.status === 'playing') {
      lastUpdateTimeRef.current = performance.now();
      fallAccumulatorRef.current = 0;
      if (!gameLoopRef.current) { // ゲーム再開時にループがなければ開始
        gameLoopRef.current = requestAnimationFrame(gameTick);
      }
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
    // gameTickをuseEffectの依存配列から削除し、gameState.statusの変更時のみ実行されるようにする
    // gameTick自体はuseCallbackでメモ化されており、その内部で最新のストア値にアクセスするため問題ない
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.status]); // gameTickを削除

  // ゲーム開始時に一度だけ呼び出す
  useEffect(() => {
    if (gameState.status === 'ready') {
        // 必要であれば初期化処理など
    }
  }, [gameState.status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4 select-none">
      <h1 className="text-4xl font-bold mb-8 text-neon-cyan">TETRIS</h1>
      <div className="flex gap-4 items-start"> {/* items-start を追加して上揃えに */} 
        <Suspense fallback={<div className='w-32 h-20 bg-gray-600 flex items-center justify-center text-white rounded-lg'>Loading...</div>}>
          <HoldPanel />
        </Suspense>
        
        <Board />
        
        <div className="flex flex-col gap-4">
          <ScorePanel />
          <NextPanel />
        </div>
      </div>

      {gameState.status === 'ready' && (
        <div className="mt-8 p-4 bg-black bg-opacity-50 rounded-lg">
          <ModeSelect
            onSelect={(mode) => {
              setMode({ mode });
              setTimeout(() => startGame(), 0);
            }}
          />
        </div>
      )}
      {gameState.status === 'paused' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
          <p className="text-3xl text-blue-400 font-bold">PAUSED</p>
          <p className="mt-4 text-lg text-gray-300">Press P to Resume</p>
        </div>
      )}
      {gameState.status === 'gameOver' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
          <p className="text-4xl text-red-500 font-bold mb-4">GAME OVER</p>
          <p className="text-2xl text-white mb-2">Score: {gameState.score.score.toLocaleString()}</p>
          <p className="text-xl text-yellow-400 animate-pulse">Press SPACE to Restart</p>
        </div>
      )}

      {/* モード別統計パネル */}
      <div className="mt-10 w-full flex justify-center">
        <StatisticsPanel />
      </div>
      {/* デバッグ情報として現在の状態を表示（本番では削除） */}
      {/* <div className='mt-4 text-xs text-gray-500'>
        Status: {gameState.status}, Level: {gameState.score.level}, Score: {gameState.score.score}, Lines: {gameState.score.lines}
      </div> */}
    </div>
  );
};

export default Game; 