// Web Audio APIラッパー
export type AudioType = 'bgm' | 'sfx';

interface AudioSettings {
  master: number;
  bgm: number;
  sfx: number;
  muted: boolean;
}

const DEFAULT_SETTINGS: AudioSettings = {
  master: 1,
  bgm: 0.7,
  sfx: 0.9,
  muted: false,
};

let audioCtx: AudioContext | null = null;
let gainNodes: Record<AudioType, GainNode> = { bgm: null as any, sfx: null as any };
let settings: AudioSettings = loadSettings();

function ensureCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodes.bgm = audioCtx.createGain();
    gainNodes.sfx = audioCtx.createGain();
    gainNodes.bgm.connect(audioCtx.destination);
    gainNodes.sfx.connect(audioCtx.destination);
    updateVolume();
  }
}

export function playAudio(buffer: AudioBuffer, type: AudioType = 'sfx', options?: { loop?: boolean; fadeIn?: number }) {
  ensureCtx();
  if (!audioCtx) return;
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = options?.loop || false;
  source.connect(gainNodes[type]);
  source.start(0);
  if (options?.fadeIn) {
    const g = gainNodes[type].gain;
    g.setValueAtTime(0, audioCtx.currentTime);
    g.linearRampToValueAtTime(settings[type] * settings.master, audioCtx.currentTime + options.fadeIn);
  }
  return source;
}

export function stopAll(type?: AudioType) {
  // Web Audio APIでは個別stop管理が必要。BGMはグローバル参照で管理推奨。
  // ここでは簡易的にcontextをsuspend/resumeで全停止/再開。
  if (!audioCtx) return;
  if (type) {
    gainNodes[type].gain.setValueAtTime(0, audioCtx.currentTime);
  } else {
    audioCtx.suspend();
  }
}

export function setVolume(type: AudioType | 'master', value: number) {
  settings[type] = value;
  updateVolume();
  saveSettings();
}

export function getVolume(type: AudioType | 'master') {
  return settings[type];
}

export function setMuted(muted: boolean) {
  settings.muted = muted;
  updateVolume();
  saveSettings();
}

export function isMuted() {
  return settings.muted;
}

function updateVolume() {
  if (!audioCtx) return;
  gainNodes.bgm.gain.value = settings.muted ? 0 : settings.bgm * settings.master;
  gainNodes.sfx.gain.value = settings.muted ? 0 : settings.sfx * settings.master;
}

function saveSettings() {
  localStorage.setItem('tetris-audio', JSON.stringify(settings));
}
function loadSettings(): AudioSettings {
  try {
    const s = localStorage.getItem('tetris-audio');
    if (s) return { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
  } catch {}
  return { ...DEFAULT_SETTINGS };
}

// AudioBufferのプリロード
export async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  ensureCtx();
  if (!audioCtx) throw new Error('AudioContext not available');
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
}

// ==============================
// 効果音システム（Phase 12.2 完全実装）
// ==============================

// プリロード済み効果音バッファ
let sfxBuffers: Record<string, AudioBuffer | null> = {
  move: null,
  rotate: null,
  lock: null,
  lineClear: null,
  tetris: null,
  levelUp: null,
  gameOver: null,
  hold: null,
};

// 効果音ファイルパス（将来的に実音声ファイルに差し替え）
const SFX_PATHS = {
  move: '/src/assets/sfx/move.wav',
  rotate: '/src/assets/sfx/rotate.wav',
  lock: '/src/assets/sfx/lock.wav',
  lineClear: '/src/assets/sfx/line-clear.wav',
  tetris: '/src/assets/sfx/tetris.wav',
  levelUp: '/src/assets/sfx/level-up.wav',
  gameOver: '/src/assets/sfx/game-over.wav',
  hold: '/src/assets/sfx/hold.wav',
};

// 効果音プリロード（初期化時に呼び出し）
export async function preloadSFX() {
  try {
    for (const [key, path] of Object.entries(SFX_PATHS)) {
      try {
        sfxBuffers[key] = await loadAudioBuffer(path);
      } catch {
        // ファイルが存在しない場合は生成音で代替
        sfxBuffers[key] = createBeepBuffer(key);
      }
    }
  } catch (error) {
    console.warn('SFX preload failed:', error);
  }
}

// 仮音声生成（実ファイルがない場合の代替）
function createBeepBuffer(type: string): AudioBuffer {
  ensureCtx();
  if (!audioCtx) throw new Error('AudioContext not available');
  
  const duration = 0.1;
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  const freqMap: Record<string, number> = {
    move: 220,
    rotate: 330,
    lock: 440,
    lineClear: 550,
    tetris: 660,
    levelUp: 880,
    gameOver: 110,
    hold: 290,
  };
  
  const frequency = freqMap[type] || 440;
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.sin(2 * Math.PI * frequency * i / audioCtx.sampleRate) * 0.3;
  }
  
  return buffer;
}

// 効果音再生関数群
export function playSFX(type: keyof typeof sfxBuffers) {
  const buffer = sfxBuffers[type];
  if (buffer) {
    playAudio(buffer, 'sfx');
  }
}

export const SFX = {
  move: () => playSFX('move'),
  rotate: () => playSFX('rotate'),
  lock: () => playSFX('lock'),
  lineClear: () => playSFX('lineClear'),
  tetris: () => playSFX('tetris'),
  levelUp: () => playSFX('levelUp'),
  gameOver: () => playSFX('gameOver'),
  hold: () => playSFX('hold'),
};

// ==============================
// BGMシステム（Phase 12.3 実装）
// ==============================

let currentBGM: AudioBufferSourceNode | null = null;
let bgmBuffer: AudioBuffer | null = null;

// BGM読み込み
export async function loadBGM(url: string) {
  try {
    bgmBuffer = await loadAudioBuffer(url);
  } catch {
    // デフォルトBGM生成（仮）
    bgmBuffer = createDefaultBGM();
  }
}

function createDefaultBGM(): AudioBuffer {
  ensureCtx();
  if (!audioCtx) throw new Error('AudioContext not available');
  
  const duration = 30; // 30秒ループ
  const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // シンプルなテトリス風メロディ生成
  const notes = [330, 294, 330, 392, 440, 392, 330, 294, 262, 262, 294, 330, 330, 294, 294];
  const noteLength = audioCtx.sampleRate * 0.5;
  
  for (let i = 0; i < data.length; i++) {
    const noteIndex = Math.floor(i / noteLength) % notes.length;
    const frequency = notes[noteIndex];
    const fade = Math.sin(Math.PI * (i % noteLength) / noteLength);
    data[i] = Math.sin(2 * Math.PI * frequency * i / audioCtx.sampleRate) * 0.1 * fade;
  }
  
  return buffer;
}

// BGM再生
export function playBGM() {
  if (!bgmBuffer) return;
  stopBGM();
  const source = playAudio(bgmBuffer, 'bgm', { loop: true });
  currentBGM = source || null;
}

// BGM停止
export function stopBGM() {
  if (currentBGM) {
    currentBGM.stop();
    currentBGM = null;
  }
}

// BGM一時停止・再開
export function pauseBGM() {
  if (!audioCtx) return;
  audioCtx.suspend();
}

export function resumeBGM() {
  if (!audioCtx) return;
  audioCtx.resume();
}

// 初期化（アプリ起動時に呼び出し推奨）
export async function initAudio() {
  ensureCtx();
  await preloadSFX();
  await loadBGM('/src/assets/bgm/tetris-theme.mp3');
} 