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