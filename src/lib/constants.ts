// ── Neon Color Palette ──────────────────────────────────────────
export const NEON = {
  cyan: "#00f0ff",
  pink: "#ff00aa",
  purple: "#bf00ff",
  blue: "#0066ff",
  green: "#00ff88",
  orange: "#ff6600",
  yellow: "#ffee00",
} as const;

// ── Scene Colors ────────────────────────────────────────────────
export const SCENE = {
  background: "#030308",
  fog: "#050510",
  gridColor: "#0a0a2e",
} as const;

// ── Bloom Settings (postprocessing) ─────────────────────────────
export const BLOOM = {
  luminanceThreshold: 0.4,
  luminanceSmoothing: 0.9,
  intensity: 1.5,
  mipmapBlur: true,
} as const;

// ── Starfield ───────────────────────────────────────────────────
export const STARFIELD = {
  count: 6000,
  radius: 150,
  size: 1.5,
  rotationSpeed: 0.02,
} as const;

// ── Camera ──────────────────────────────────────────────────────
export const CAMERA = {
  initialPosition: [0, 2, 20] as [number, number, number],
  fov: 60,
  near: 0.1,
  far: 500,
  parallaxFactor: 0.3,
  parallaxSmoothing: 0.05,
} as const;

// ── App Card 3D ─────────────────────────────────────────────────
export const APP_CARD = {
  width: 2.4,
  height: 3.2,
  depth: 0.15,
  borderRadius: 0.2,
  floatSpeed: 2,
  floatIntensity: 0.4,
  floatRange: [-0.1, 0.1] as [number, number],
  emissiveIntensity: 3,
  iconSize: 1.2,
} as const;

// ── Grid ────────────────────────────────────────────────────────
export const GRID = {
  size: 200,
  divisions: 80,
  fadeDistance: 60,
  fadeStrength: 1.5,
} as const;
