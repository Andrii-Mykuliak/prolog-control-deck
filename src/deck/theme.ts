import { loadFont as loadTektur } from "@remotion/google-fonts/Tektur";
import { loadFont as loadZen } from "@remotion/google-fonts/ZenDots";
import { loadFont as loadComfortaa } from "@remotion/google-fonts/Comfortaa";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/PressStart2P";

const zen = loadZen("normal", { weights: ["400"], subsets: ["latin"] });
const tektur = loadTektur("normal", { weights: ["500", "700", "800"], subsets: ["latin", "cyrillic"] });
const comfortaa = loadComfortaa("normal", { weights: ["400", "500", "700"], subsets: ["latin", "cyrillic"] });
const mono = loadMono("normal", { weights: ["400", "600", "700"], subsets: ["latin", "cyrillic"] });
const pixel = loadPixel("normal", { weights: ["400"], subsets: ["latin", "cyrillic"] });

// Zen Dots has no Cyrillic: Latin glyphs of headings use it, Cyrillic glyphs fall back to Tektur.
export const F = {
  head: `${zen.fontFamily}, ${tektur.fontFamily}, sans-serif`,
  title: `${tektur.fontFamily}, sans-serif`,
  body: `${comfortaa.fontFamily}, Arial, sans-serif`,
  mono: `${mono.fontFamily}, monospace`,
  pixel: `${pixel.fontFamily}, monospace`,
};

// JetBrains Mono advance width is exactly 0.6em, used to place annotations under code columns.
export const CH = 0.6;

export const C = {
  bg: "#29261a",
  panel: "#353122",
  panel2: "#403b29",
  line: "#5e5841",
  text: "#f4efd6",
  dim: "#c4bc95",
  faint: "#857e5c",
  accent: "#f673a9",
  accentHi: "#ff8fbd",
  pink: "#f673a9",
  mint: "#93c47d",
  blue: "#6aa4d6",
  red: "#ef6b6b",
  amber: "#f2c14e",
  orange: "#f59e72",
  lav: "#7ec8d4",
  kw: "#f673a9",
  op: "#c4bc95",
  comment: "#8a8466",
  cream: "#ece5b4",
  purple: "#9a4496",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;
