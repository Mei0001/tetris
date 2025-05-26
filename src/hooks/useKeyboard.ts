import { useEffect, useRef } from 'react';
import { DEFAULT_KEY_BINDINGS } from '../constants/game';
import { useGameStore } from '../stores/gameStore';

export type KeyboardAction = keyof typeof DEFAULT_KEY_BINDINGS;

interface UseKeyboardOptions {
  onAction?: (action: KeyboardAction, event: KeyboardEvent) => void;
  keyBindings?: Partial<Record<KeyboardAction, string[]>>;
  das?: number;
  arr?: number;
}

/**
 * キーボード入力ハンドリング（DAS/ARR対応・カスタムキーマッピング）
 */
export function useKeyboard({ onAction, keyBindings = {}, das = 170, arr = 0 }: UseKeyboardOptions) {
  const timerRef = useRef<number | null>(null);
  const repeatKeyRef = useRef<string | null>(null);
  const holdCurrentPiece = useGameStore((s) => s.holdCurrentPiece);

  // マージしたキーマップ
  const mergedBindings = { ...DEFAULT_KEY_BINDINGS, ...keyBindings };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const action in mergedBindings) {
        const keys = mergedBindings[action as KeyboardAction] || [];
        if (keys.includes(e.code) || keys.includes(e.key)) {
          if (repeatKeyRef.current !== e.code) {
            onAction?.(action as KeyboardAction, e);
            repeatKeyRef.current = e.code;
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(function repeat() {
              onAction?.(action as KeyboardAction, e);
              timerRef.current = setTimeout(repeat, arr);
            }, das);
          }
          break;
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (repeatKeyRef.current === e.code) {
        repeatKeyRef.current = null;
        if (timerRef.current) clearTimeout(timerRef.current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onAction, JSON.stringify(keyBindings), das, arr]);
} 