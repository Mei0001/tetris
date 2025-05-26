import type { Tetromino, TetrominoType, RotationState, TetrominoShape, Position, GameBoard } from '../types';
import { TETROMINO_SHAPES, INITIAL_ROTATION_STATE, BOARD_WIDTH, SRS_WALL_KICKS_JLSTZ, SRS_WALL_KICKS_I, getWallKickData as getWallKickDataConstant, getNextRotation as getNextRotationConstant } from '../constants/tetrominos';
import { checkCollision } from './gameLogic'; // checkCollision をインポート
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

/**
 * SRSに基づいて回転後の形状と位置、使用されたキックオフセットを返す
 * @param piece 回転するピース
 * @param clockwise 時計回りか
 * @param board 現在の盤面（衝突判定用）
 * @returns 回転後の形状、位置、キックオフセット。回転不可の場合はnullを返す。
 */
export interface RotatedPieceData {
  newShape: TetrominoShape;
  newPosition: Position;
  newRotationState: RotationState;
  kickUsed: Position; // 実際に適用されたキックテストのオフセット
}

export function getRotatedShapeAndPosition(
  piece: Tetromino,
  clockwise: boolean,
  board: GameBoard 
): RotatedPieceData | null {
  const { type, rotation: currentRotation, position: currentPosition } = piece;
  const nextRotation = getNextRotationConstant(currentRotation, clockwise);
  const newShape = getTetrominoPattern(type, nextRotation);

  // 1. 基本回転位置 (キックなし)
  if (!checkCollision(board, newShape, currentPosition)) {
    return { newShape, newPosition: currentPosition, newRotationState: nextRotation, kickUsed: { x: 0, y: 0 } };
  }

  // 2. ウォールキックテスト
  const kickTable = getWallKickDataConstant(type);
  const kickKey = `${currentRotation}_${nextRotation}` as keyof typeof kickTable;
  const kickTests = kickTable[kickKey];

  if (kickTests) {
    for (const kick of kickTests) {
      const testPosition = {
        x: currentPosition.x + kick.x,
        y: currentPosition.y - kick.y, // SRSのキックデータはY軸が逆（上方向が正）なので調整
      };
      if (!checkCollision(board, newShape, testPosition)) {
        return { newShape, newPosition: testPosition, newRotationState: nextRotation, kickUsed: kick };
      }
    }
  }
  
  return null; // 全てのキックテストに失敗
} 