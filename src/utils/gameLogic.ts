import type { GameBoard, Tetromino, Position, TSpinType, RotationState } from '../types';

// 仮のヘルパー関数 (本来は utils/matrix.ts などからimport)
const isInsideBoard = (position: Position, boardWidth: number, boardHeight: number): boolean => {
  return position.x >= 0 && position.x < boardWidth && position.y >= 0 && position.y < boardHeight;
};
const isPositionOccupied = (board: GameBoard, position: Position): boolean => {
  return board[position.y]?.[position.x] === 'filled';
};
// ここまで仮のヘルパー

/**
 * Tミノのコーナーが塞がれているかチェック (piece.position基準の相対座標)
 */
const isCornerBlocked = (board: GameBoard, piece: Tetromino, cornerOffset: Position): boolean => {
  // Tミノの回転軸は、形状(3x3 or 4x4)の中心に近い点。
  // SRSではTミノは3x3として扱われ、中心は(1,1)。
  // piece.shapeは回転後のパターン、piece.positionはその左上基点。
  // コーナーチェックのため、Tミノの中心からの相対位置で考える必要がある。

  // 仮に、piece.shape の (1,1) が T の中心軸だと仮定する。
  // cornerOffset は、その中心からの相対座標とする。
  // 例: {x: -1, y: -1} は中心から見て左上。

  // Tミノの中心の絶対座標
  const pieceCenterX = piece.position.x + 1; 
  const pieceCenterY = piece.position.y + 1;

  const checkPos = {
    x: pieceCenterX + cornerOffset.x,
    y: pieceCenterY + cornerOffset.y,
  };

  if (!isInsideBoard(checkPos, board[0].length, board.length)) return true;
  return isPositionOccupied(board, checkPos);
};

/**
 * T-Spin判定 (SRS Guideline準拠の試み)
 * @param board 現在の盤面
 * @param piece ロックされたTミノ (形状は回転後のもの)
 * @param lastMoveWasRotation 直前の操作が回転だったか
 * @param kickUsed ウォールキック/フロアキックが使用されたか (x,yのオフセット。なければ {x:0,y:0})
 * @returns TSpinType ('none', 'mini', 'regular')
 */
export const checkTSpin = (
  board: GameBoard,
  piece: Tetromino,
  lastMoveWasRotation: boolean,
  // kickUsed: Position, // キック情報はより正確な判定に必要だが今回は省略
): TSpinType => {
  if (piece.type !== 'T' || !lastMoveWasRotation) {
    return 'none';
  }

  // Tミノの中心を(0,0)としたときの4つのコーナーの相対座標
  const corners = [
    { x: -1, y: -1 }, // A: 左上
    { x:  1, y: -1 }, // B: 右上
    { x: -1, y:  1 }, // C: 左下
    { x:  1, y:  1 }, // D: 右下
  ];

  // 各コーナーが実際にブロックされているか
  const blockedStatus = corners.map(corner => isCornerBlocked(board, piece, corner));

  const numBlockedCorners = blockedStatus.filter(Boolean).length;

  if (numBlockedCorners < 3) {
    return 'none'; // 3つ以上塞がれていない場合はT-Spinではない
  }

  // T-Spin成立条件 (A,B,C,D は Tミノの中心から見たときの4隅)
  // 判定基準点: Tミノが回転したときの中心 (SRSではピース内の特定オフセット)
  // piece.position は回転後の形状の左上。
  // piece.rotation が回転状態 (0,1,2,3)
  
  // 「前面」コーナー: Tミノの平らな3つのブロックが向いている方向の2つのコーナー
  // 「背面」コーナー: Tミノの尖った部分が向いている方向の2つのコーナー
  let frontCorners: [Position, Position];
  let backCorners: [Position, Position];

  // Tミノの中心を(1,1)として、回転状態に応じた前面/背面のコーナーを選択
  switch (piece.rotation) {
    case 0: // 上向き (デフォルト)
      frontCorners = [{x: -1, y: -1}, {x: 1, y: -1}]; // A, B
      backCorners =  [{x: -1, y: 1}, {x: 1, y: 1}];   // C, D
      break;
    case 1: // 右向き
      frontCorners = [{x: 1, y: -1}, {x: 1, y: 1}];   // B, D
      backCorners =  [{x: -1, y: -1}, {x: -1, y: 1}]; // A, C
      break;
    case 2: // 下向き
      frontCorners = [{x: 1, y: 1}, {x: -1, y: 1}];   // D, C
      backCorners =  [{x: 1, y: -1}, {x: -1, y: -1}]; // B, A
      break;
    case 3: // 左向き
      frontCorners = [{x: -1, y: 1}, {x: -1, y: -1}]; // C, A
      backCorners =  [{x: 1, y: 1}, {x: 1, y: -1}];   // D, B
      break;
    default:
      return 'none'; // ありえない
  }

  const numFrontBlocked = frontCorners.map(c => isCornerBlocked(board, piece, c)).filter(Boolean).length;
  const numBackBlocked = backCorners.map(c => isCornerBlocked(board, piece, c)).filter(Boolean).length;

  // Regular T-Spin: 前面2つのコーナーが塞がれ、かつ背面コーナーのどちらか1つ以上が塞がれている
  if (numFrontBlocked === 2 && numBackBlocked >= 1) {
    return 'regular';
  }
  
  // Mini T-Spin: 前面1つのコーナーが塞がれ、かつ背面2つのコーナーが塞がれている
  // (注: これはSRSのMini T-Spinの一条件であり、ウォールキック未使用なども考慮される)
  if (numFrontBlocked === 1 && numBackBlocked === 2) {
    // T-Spin Mini の条件は、回転によってTミノが特定のキック位置(例: (0,0)以外)に移動した場合など、より複雑。
    // ここでは、単純に3コーナー塞がっていて、上記のRegular条件に合致しない場合をMiniとする(不正確)
    return 'mini';
  }
  
  // 上記でRegularと判定されず、3コーナー以上塞がっていればMiniとする（より単純な判定）
  if (numBlockedCorners >= 3) {
      return 'mini';
  }

  return 'none';
}; 