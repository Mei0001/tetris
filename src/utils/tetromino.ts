import type { Tetromino, TetrominoType, RotationState, TetrominoShape } from '../types';
import { TETROMINO_SHAPES, INITIAL_ROTATION_STATE, BOARD_WIDTH } from '../constants/tetrominos';
// import { getRandomTetrominoType } from './randomizer'; // TODO: パス解決

/**
 * 指定されたテトロミノタイプと回転状態に基づいて形状データを取得する
 * (constants/tetrominos.tsにも同名関数があるが、こちらはutils内での利用を想定し再定義)
 */
export function getTetrominoPattern(type: TetrominoType, rotation: RotationState): TetrominoShape {
  return TETROMINO_SHAPES[type][rotation];
}

// 仮のランダム関数 (randomizer解決までの暫定)
function getRandomTetrominoType_TEMP(): TetrominoType {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 新しいテトロミノオブジェクトを生成する
 * @param boardWidth ボード幅（中央配置のため）
 * @param type 指定タイプ（省略時はランダム）
 * @returns 新しいTetrominoオブジェクト
 */
export function createNewTetromino(boardWidthParam?: number, type?: TetrominoType): Tetromino {
  const currentBoardWidth = boardWidthParam ?? BOARD_WIDTH;
  const tetrominoType = type || getRandomTetrominoType_TEMP(); // 暫定呼び出し
  const shape = getTetrominoPattern(tetrominoType, INITIAL_ROTATION_STATE);
  
  let shapeWidth = 0;
  if (shape && shape.length > 0 && shape[0] && shape[0].length > 0) {
    shapeWidth = shape[0].length;
  }

  const position = {
    x: Math.floor((currentBoardWidth - shapeWidth) / 2),
    y: 0, // 上部から出現
  };
  return {
    type: tetrominoType,
    shape,
    position,
    rotation: INITIAL_ROTATION_STATE,
    lockDelay: 500, // デフォルトロック遅延
  };
} 