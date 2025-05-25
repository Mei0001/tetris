import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Tetrisアプリのメインレイアウト
 * - ゲームボード・サイドパネル・ヘッダー等の枠組み
 * - レスポンシブ対応
 * - ダーク&ネオンUI
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-white flex flex-col">
      {/* ヘッダー */}
      <header className="w-full py-4 px-6 flex items-center justify-between border-b border-white/10 shadow-md bg-black/40 backdrop-blur-md">
        <h1 className="text-2xl md:text-3xl font-game neon-glow tracking-widest select-none">
          <span className="text-neon-cyan">TETRIS</span>
        </h1>
        {/* ここに将来的にメニューや設定ボタン等 */}
      </header>
      {/* メインエリア */}
      <AnimatePresence mode="wait">
        <motion.main
          key={typeof children === 'string' ? children : undefined}
          className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 p-4 md:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {/* フッター */}
      <footer className="w-full py-2 text-center text-xs text-white/60 bg-black/30">
        &copy; {new Date().getFullYear()} Tetris Web App
      </footer>
    </div>
  );
};

export default MainLayout; 