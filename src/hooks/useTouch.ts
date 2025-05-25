import { useEffect, useRef } from 'react';

export type TouchAction = 'moveLeft' | 'moveRight' | 'softDrop' | 'hardDrop' | 'rotateClockwise' | 'rotateCounterclockwise' | 'hold';

interface UseTouchOptions {
  onAction: (action: TouchAction, event: TouchEvent) => void;
  sensitivity?: number;
}

/**
 * タッチ操作（スワイプ・タップ等）をアクションに変換するカスタムフック
 */
export function useTouch({ onAction, sensitivity = 30 }: UseTouchOptions) {
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > sensitivity) onAction('moveRight', e);
        else if (dx < -sensitivity) onAction('moveLeft', e);
      } else {
        if (dy > sensitivity) onAction('softDrop', e);
        else if (dy < -sensitivity) onAction('hardDrop', e);
        else onAction('rotateClockwise', e); // タップ扱い
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onAction, sensitivity]);
} 