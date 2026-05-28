// ── Programmatic Web Audio Synth Engine ────────────────────────
// Purely synthesized audio in the browser. Zero asset download requirements.
// Fully robust, latency-free, and cross-platform.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let spaceDrone: { osc1: OscillatorNode; osc2: OscillatorNode; filter: BiquadFilterNode; gain: GainNode } | null = null;

// Spatial Panner Nodes mapping: appId -> Web Audio PannerNode
const spatialPanners: Record<string, PannerNode> = {};
const spatialSources: Record<string, { osc: OscillatorNode; gain: GainNode } | null> = {};

/**
 * Lazy-initializer for the Web Audio Context.
 * Required because browsers block AudioContext construction before user interaction.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // Cross-platform standard initialization
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Initializes the entire master cybernetic synthesizer tree.
 */
export function initSynthEngine() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // 1. Create Master Volume regulator (Gain)
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime); // start silent for smooth fade-in
    masterGain.connect(ctx.destination);
  }

  // Resume context if suspended (browser security)
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  // 2. Start Deep Detuned Cyber Space Hum (Space Drone)
  if (!spaceDrone) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const droneGain = ctx.createGain();

    // Detuned frequencies to create a slow phase beating effect
    osc1.frequency.setValueAtTime(55.0, ctx.currentTime); // A1
    osc2.frequency.setValueAtTime(55.3, ctx.currentTime); // slightly detuned

    osc1.type = "sawtooth";
    osc2.type = "triangle";

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(140, ctx.currentTime); // filter out buzzing high harmonics
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    droneGain.gain.setValueAtTime(0.08, ctx.currentTime); // deep background balance

    // Assemble routing chain
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(masterGain);

    osc1.start();
    osc2.start();

    spaceDrone = { osc1, osc2, filter, gain: droneGain };
  }

  // 3. Setup Spatial Panner loops for key applications (Dayzero, Ninniai)
  setupSpatialAppLoops(ctx);
}

/**
 * Fades in the master volume smoothly.
 */
export function fadeInSynth(duration = 1.5) {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  
  masterGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + duration); // set master volume comfort
}

/**
 * Fades out the master volume smoothly.
 */
export function fadeOutSynth(duration = 0.8) {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;
  masterGain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + duration);
}

/**
 * Micro-Interaction Hover Tick Sound.
 * Very fast, clean digital synthesizer click.
 */
export function playHoverSound() {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, ctx.currentTime); // high pitch chirp
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.04);

  gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.045);
}

/**
 * Micro-Interaction Click Swoop Sound.
 * Low-frequency digital trigger.
 */
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || ctx.state === "suspended") return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(700, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.07);

  gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.07);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

/**
 * Micro-Interaction AI Chat Notification Sound.
 * Two quick dual-tone digital chime beeps.
 */
export function playChatNotificationSound() {
  const ctx = getAudioContext();
  if (!ctx || !masterGain || ctx.state === "suspended") return;

  // Tone 1
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
  gain1.gain.setValueAtTime(0.03, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  
  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start();
  osc1.stop(ctx.currentTime + 0.13);

  // Tone 2 (slightly delayed)
  const delay = 0.065;
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + delay); // E6
  gain2.gain.setValueAtTime(0.0, ctx.currentTime);
  gain2.gain.setValueAtTime(0.03, ctx.currentTime + delay);
  gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.15);

  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(ctx.currentTime + delay);
  osc2.stop(ctx.currentTime + delay + 0.16);
}

/**
 * Sets up 3D Positional Panner nodes for Dayzero and Ninniai.
 */
function setupSpatialAppLoops(ctx: AudioContext) {
  if (!masterGain) return;

  // 1. Dayzero: A slow, recurring digital space chime
  if (!spatialPanners["dayzero"]) {
    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 15;
    panner.rolloffFactor = 1.5;
    
    // Set position deep left-front: matching [-3, 0.5, 0] roughly
    panner.positionX.setValueAtTime(-3, ctx.currentTime);
    panner.positionY.setValueAtTime(0.5, ctx.currentTime);
    panner.positionZ.setValueAtTime(0, ctx.currentTime);

    panner.connect(masterGain);
    spatialPanners["dayzero"] = panner;

    // Start a programmatic spatial chime loop every 6 seconds
    setInterval(() => {
      if (ctx.state === "suspended" || !masterGain || masterGain.gain.value < 0.05) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.linearRampToValueAtTime(783.99, ctx.currentTime + 1.2); // slide up to G5

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(panner);

      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    }, 6000);
  }

  // 2. Ninniai: A continuous, extremely soothing spatial pink-noise / sweep lullaby wave
  if (!spatialPanners["ninniai"]) {
    const panner = ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 1;
    panner.maxDistance = 15;
    panner.rolloffFactor = 1.5;

    // Set position deep right-front: matching [3, -0.2, -2]
    panner.positionX.setValueAtTime(3, ctx.currentTime);
    panner.positionY.setValueAtTime(-0.2, ctx.currentTime);
    panner.positionZ.setValueAtTime(-2, ctx.currentTime);

    panner.connect(masterGain);
    spatialPanners["ninniai"] = panner;

    // Start continuous soothing lullaby oscillator sweep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3

    gain.gain.setValueAtTime(0.015, ctx.currentTime); // extremely soft

    osc.connect(gain);
    gain.connect(panner);

    osc.start();

    // Periodically modulate frequency in a soothing loop (lullaby breathing)
    let up = true;
    setInterval(() => {
      if (ctx.state === "suspended") return;
      const targetFreq = up ? 293.66 : 220.00; // alternate D4 and A3
      osc.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + 2.5);
      up = !up;
    }, 3000);

    spatialSources["ninniai"] = { osc, gain };
  }
}

/**
 * Updates the 3D Audio Panner Node spatial coordinates dynamically relative to the Camera.
 */
export function updateSpatialPanner(appId: string, x: number, y: number, z: number) {
  const ctx = getAudioContext();
  const panner = spatialPanners[appId];
  if (ctx && panner) {
    panner.positionX.setTargetAtTime(x, ctx.currentTime, 0.1);
    panner.positionY.setTargetAtTime(y, ctx.currentTime, 0.1);
    panner.positionZ.setTargetAtTime(z, ctx.currentTime, 0.1);
  }
}

/**
 * Updates Web Audio Listener coordinates based on standard 3D Camera coordinates.
 * This aligns standard R3F listener orientation with Web Audio API.
 */
export function updateListenerPosition(camX: number, camY: number, camZ: number, dirX: number, dirY: number, dirZ: number) {
  const ctx = getAudioContext();
  if (ctx && ctx.listener) {
    // Aligns spatial positioning cleanly on standard WebAudio standard
    const l = ctx.listener;
    if (l.positionX) {
      l.positionX.setTargetAtTime(camX, ctx.currentTime, 0.05);
      l.positionY.setTargetAtTime(camY, ctx.currentTime, 0.05);
      l.positionZ.setTargetAtTime(camZ, ctx.currentTime, 0.05);
      l.forwardX.setTargetAtTime(dirX, ctx.currentTime, 0.05);
      l.forwardY.setTargetAtTime(dirY, ctx.currentTime, 0.05);
      l.forwardZ.setTargetAtTime(dirZ, ctx.currentTime, 0.05);
    } else {
      // Fallback for older Safari implementations
      l.setPosition(camX, camY, camZ);
      l.setOrientation(dirX, dirY, dirZ, 0, 1, 0);
    }
  }
}
