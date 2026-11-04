/**
 * Web Audio API synthesized chimes for study focus timer
 * Pure browser audio synthesis without external media dependencies.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
};

/**
 * Pleasant harmonic celebration chime when a focus session or break completes
 */
export const playCompletionChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const notes = [
      { freq: 523.25, time: 0.00, dur: 0.8 }, // C5
      { freq: 659.25, time: 0.15, dur: 0.8 }, // E5
      { freq: 783.99, time: 0.30, dur: 1.2 }, // G5
      { freq: 1046.50, time: 0.45, dur: 1.4 }, // C6
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.18, now + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  } catch (err) {
    console.debug('Audio chime skipped', err);
  }
};

/**
 * Subtle start tone when user begins a focus session
 */
export const playStartChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.15); // D5

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch {
    // Ignore audio permission warnings
  }
};

/**
 * Gentle chime when transitioning between AI schedule intervals
 */
export const playIntervalTransitionChime = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 440, time: 0.0, dur: 0.4 },  // A4
      { freq: 659.25, time: 0.15, dur: 0.6 }, // E5
      { freq: 880, time: 0.30, dur: 0.8 }, // A5
    ];

    notes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.0001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.14, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  } catch {
    // Audio context suspended or user gesture required
  }
};

// Ambient Sound Engine State
let ambientGainNode: GainNode | null = null;
let ambientSourceNodes: (AudioNode | number)[] = [];
let currentAmbientType: string = 'none';

/**
 * Creates 5 seconds of looped white/pink noise buffer
 */
const createNoiseBuffer = (ctx: AudioContext, pink: boolean = false): AudioBuffer => {
  const bufferSize = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    if (pink) {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      data[i] = white * 0.15;
    }
  }
  return buffer;
};

/**
 * Stop active ambient soundscape
 */
export const stopAmbientSound = () => {
  try {
    ambientSourceNodes.forEach(node => {
      if (typeof node === 'object' && 'stop' in node && typeof (node as any).stop === 'function') {
        try {
          (node as any).stop();
        } catch {}
      } else if (typeof node === 'number') {
        window.clearInterval(node);
      }
    });
    ambientSourceNodes = [];
    currentAmbientType = 'none';
  } catch {}
};

/**
 * Set ambient volume (0 to 1)
 */
export const setAmbientSoundVolume = (vol: number) => {
  try {
    if (ambientGainNode) {
      const clamped = Math.max(0, Math.min(1, vol));
      ambientGainNode.gain.setTargetAtTime(clamped * 0.25, ambientGainNode.context.currentTime, 0.1);
    }
  } catch {}
};

/**
 * Start synthesizing calming ambient background soundscape
 */
export const startAmbientSound = (
  type: 'rain' | 'white_noise' | 'alpha_waves' | 'forest',
  volume: number = 0.5
) => {
  try {
    stopAmbientSound();
    const ctx = getAudioContext();
    if (!ctx) return;

    currentAmbientType = type;
    const masterGain = ctx.createGain();
    const clamped = Math.max(0, Math.min(1, volume));
    masterGain.gain.setValueAtTime(clamped * 0.25, ctx.currentTime);
    masterGain.connect(ctx.destination);
    ambientGainNode = masterGain;

    if (type === 'white_noise') {
      const buffer = createNoiseBuffer(ctx, false);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, ctx.currentTime);

      source.connect(filter);
      filter.connect(masterGain);
      source.start();
      ambientSourceNodes.push(source);
    } else if (type === 'rain') {
      const buffer = createNoiseBuffer(ctx, true);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);

      source.connect(filter);
      filter.connect(masterGain);
      source.start();
      ambientSourceNodes.push(source);
    } else if (type === 'alpha_waves') {
      // 432 Hz Base Tone + 442 Hz Harmonic = 10Hz Alpha Brainwave rhythm
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);
      gain1.gain.setValueAtTime(0.5, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(442, ctx.currentTime); // 10Hz binaural/beat modulation
      gain2.gain.setValueAtTime(0.5, ctx.currentTime);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);

      osc1.start();
      osc2.start();
      ambientSourceNodes.push(osc1, osc2);
    } else if (type === 'forest') {
      const buffer = createNoiseBuffer(ctx, true);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      // Gentle LFO modulation to simulate wind breeze
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime); // 0.2 Hz wave
      lfoGain.gain.setValueAtTime(200, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      source.connect(filter);
      filter.connect(masterGain);

      source.start();
      lfo.start();
      ambientSourceNodes.push(source, lfo);
    }
  } catch (err) {
    console.debug('Ambient sound start ignored:', err);
  }
};
