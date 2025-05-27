import { useEffect, useRef } from 'react';

export type TouchAction = 'moveLeft' | 'moveRight' | 'softDrop' | 'hardDrop' | 'rotateClockwise' | 'rotateCounterclockwise' | 'hold' | 'longPress';

interface UseTouchOptions {
  onAction: (action: TouchAction, event: TouchEvent) => void;
  sensitivity?: number;
}

/**
 * タッチ操作（スワイプ・タップ・長押し等）をアクションに変換するカスタムフック
 */
export function useTouch({ onAction, sensitivity = 30 }: UseTouchOptions) {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const longPressTimeout = useRef<number | null>(null);
  const longPressed = useRef(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startTime.current = Date.now();
      longPressed.current = false;
      longPressTimeout.current = window.setTimeout(() => {
        longPressed.current = true;
        onAction('hold', e);
      }, 500); // 500ms以上でlongPress
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
      if (longPressed.current) return; // 既にlongPress発火済み
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;
      const dt = Date.now() - startTime.current;
      if (Math.abs(dx) < sensitivity && Math.abs(dy) < sensitivity && dt < 500) {
        onAction('rotateClockwise', e); // タップ
      } else if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > sensitivity) onAction('moveRight', e);
        else if (dx < -sensitivity) onAction('moveLeft', e);
      } else {
        if (dy > sensitivity) onAction('softDrop', e);
        else if (dy < -sensitivity) onAction('hardDrop', e);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    };
  }, [onAction, sensitivity]);
} 