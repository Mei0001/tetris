import type { AnimationConfig, ButtonSize, ButtonVariant, ModalSize } from './index';
import type { ReactNode, CSSProperties, MouseEvent } from 'react';

// ==============================
// テーマ関連
// ==============================

/** テーマタイプ */
export type ThemeType = 'dark' | 'light' | 'neon' | 'retro' | 'custom';

/** カラースキーム */
export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

/** テーマ設定 */
export interface Theme {
  name: string;
  type: ThemeType;
  colors: ColorScheme;
  animations: {
    fast: string;
    normal: string;
    slow: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
}

// ==============================
// コンポーネントプロパティ
// ==============================

/** 基本コンポーネントプロパティ */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  style?: CSSProperties;
}

/** ボタンプロパティ */
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/** モーダルプロパティ */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children?: ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
}

// ==============================
// レイアウト関連
// ==============================

/** レスポンシブブレークポイント */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** グリッドレイアウト設定 */
export interface GridConfig {
  columns: number;
  gap: number;
  responsive?: Partial<Record<Breakpoint, { columns: number; gap: number }>>;
}

/** フレックスレイアウト設定 */
export interface FlexConfig {
  direction: 'row' | 'column';
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  gap?: number;
}

// ==============================
// ゲームUI関連
// ==============================

/** ゲームパネルタイプ */
export type GamePanelType = 
  | 'score'
  | 'next'
  | 'hold'
  | 'level'
  | 'lines'
  | 'timer'
  | 'controls';

/** ゲームパネル設定 */
export interface GamePanelConfig {
  type: GamePanelType;
  position: 'left' | 'right' | 'top' | 'bottom';
  visible: boolean;
  size: 'small' | 'medium' | 'large';
  collapsible?: boolean;
}

/** HUD（ヘッドアップディスプレイ）設定 */
export interface HUDConfig {
  panels: GamePanelConfig[];
  opacity: number;
  autoHide: boolean;
  autoHideDelay: number;
}

// ==============================
// 入力関連
// ==============================

/** キーバインド設定 */
export interface KeyBinding {
  action: string;
  keys: string[];
  description: string;
  category: string;
}

/** タッチジェスチャー */
export type TouchGesture = 
  | 'tap'
  | 'swipeLeft'
  | 'swipeRight' 
  | 'swipeUp'
  | 'swipeDown'
  | 'longPress'
  | 'pinch'
  | 'rotate';

/** タッチ設定 */
export interface TouchConfig {
  enabled: boolean;
  sensitivity: number;
  gestures: Record<TouchGesture, string>; // ジェスチャーとアクションのマッピング
  vibration: boolean;
}

// ==============================
// アニメーション関連
// ==============================

/** アニメーション種類 */
export type AnimationType = 
  | 'fadeIn'
  | 'fadeOut'
  | 'slideIn'
  | 'slideOut'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'shake'
  | 'glow'
  | 'pulse';

/** アニメーション設定 */
export interface AnimationSettings {
  type: AnimationType;
  duration: number;
  delay?: number;
  easing?: string;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate';
}

// ==============================
// 通知関連
// ==============================

/** 通知タイプ */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/** 通知設定 */
export interface NotificationConfig {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  position?: 'top' | 'bottom' | 'center';
}

// ==============================
// ツールチップ関連
// ==============================

/** ツールチップ位置 */
export type TooltipPosition = 
  | 'top' 
  | 'bottom' 
  | 'left' 
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

/** ツールチッププロパティ */
export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
  disabled?: boolean;
  children: ReactNode;
}

// ==============================
// メニュー関連
// ==============================

/** メニューアイテム */
export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  onClick?: () => void;
  submenu?: MenuItem[];
}

/** メニュー設定 */
export interface MenuConfig {
  items: MenuItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'hover' | 'contextMenu';
  closeOnClick?: boolean;
} 