import { useEffect, useRef, useState } from 'react'
import { SettingField } from './WheelSettings'

const STORAGE_KEY = 'mywheel-theme';

const DEFAULT_THEME = {
  // Background
  mode: 'glow',
  bgColor: '#0b0b1a',
  color1: '#6366f1',
  color2: '#ec4899',
  glowStrength: 0.25,
  angle: 135,
  image: null,
  imageBlur: 0,
  dim: 0.3,
  animate: false,
  hueCycle: false,
  // Colors & glass
  primary: '#6366f1',
  accent: '#ec4899',
  wheelGlow: '#6366f1',
  cardOpacity: 0.05,
  cardBlur: 12,
  cornerRadius: 16,
  // Fun
  particles: 'none',
  particleCount: 40,
};

const PRESETS = [
  { name: 'Midnight', theme: {} },
  {
    name: 'Sunset',
    theme: { mode: 'gradient', bgColor: '#1a0b14', color1: '#f97316', color2: '#be185d', angle: 160, dim: 0.35, primary: '#f97316', accent: '#e11d48', wheelGlow: '#f97316' },
  },
  {
    name: 'Ocean',
    theme: { bgColor: '#03121f', color1: '#0ea5e9', color2: '#14b8a6', glowStrength: 0.35, primary: '#0284c7', accent: '#14b8a6', wheelGlow: '#0ea5e9', particles: 'bubbles', particleCount: 25 },
  },
  {
    name: 'Forest',
    theme: { bgColor: '#07140d', color1: '#22c55e', color2: '#eab308', glowStrength: 0.22, primary: '#16a34a', accent: '#ca8a04', wheelGlow: '#22c55e' },
  },
  {
    name: 'Aurora',
    theme: { mode: 'gradient', bgColor: '#050816', color1: '#4c1d95', color2: '#0f766e', angle: 200, dim: 0.2, animate: true, primary: '#8b5cf6', accent: '#2dd4bf', wheelGlow: '#2dd4bf', particles: 'stars', particleCount: 60 },
  },
  {
    name: 'Candy',
    theme: { mode: 'gradient', bgColor: '#1f0a1a', color1: '#f472b6', color2: '#a78bfa', angle: 135, dim: 0.45, primary: '#db2777', accent: '#8b5cf6', wheelGlow: '#f472b6', particles: 'hearts', particleCount: 20 },
  },
  {
    name: 'Winter',
    theme: { mode: 'solid', bgColor: '#0f172a', primary: '#38bdf8', accent: '#a5b4fc', wheelGlow: '#38bdf8', particles: 'snow', particleCount: 70 },
  },
];

const PARTICLE_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'snow', label: '❄️ Snow' },
  { value: 'bubbles', label: '🫧 Bubbles' },
  { value: 'stars', label: '✨ Twinkling stars' },
  { value: 'hearts', label: '💗 Hearts' },
  { value: 'confetti', label: '🎊 Confetti rain' },
];

// `modes` limits a field to the background modes it applies to
const THEME_GROUPS = [
  {
    title: 'Background',
    fields: [
      { key: 'mode', label: 'Style', type: 'select', options: [{ value: 'glow', label: 'Glow' }, { value: 'gradient', label: 'Gradient' }, { value: 'solid', label: 'Solid color' }, { value: 'image', label: 'Picture' }] },
      { key: 'bgColor', label: 'Base color', type: 'color', modes: ['glow', 'solid', 'image'] },
      { key: 'color1', label: 'First color', type: 'color', modes: ['glow', 'gradient'] },
      { key: 'color2', label: 'Second color', type: 'color', modes: ['glow', 'gradient'] },
      { key: 'glowStrength', label: 'Glow strength', type: 'range', min: 0, max: 1, step: 0.01, percent: true, modes: ['glow'] },
      { key: 'angle', label: 'Gradient angle', type: 'range', min: 0, max: 360, step: 1, unit: '°', modes: ['gradient'] },
      { key: 'image', label: 'Background picture', type: 'image', dataUrl: true, modes: ['image'] },
      { key: 'imageBlur', label: 'Picture blur', type: 'range', min: 0, max: 20, step: 1, unit: 'px', modes: ['image'] },
      { key: 'dim', label: 'Darken', type: 'range', min: 0, max: 0.9, step: 0.01, percent: true, hint: 'Keeps text readable on bright backgrounds', modes: ['gradient', 'image'] },
      { key: 'animate', label: 'Slowly drift', type: 'checkbox', modes: ['glow', 'gradient', 'image'] },
      { key: 'hueCycle', label: 'Rainbow color cycle', type: 'checkbox' },
    ],
  },
  {
    title: 'Colors & Glass',
    fields: [
      { key: 'primary', label: 'Primary color', type: 'color' },
      { key: 'accent', label: 'Accent color', type: 'color' },
      { key: 'wheelGlow', label: 'Wheel glow', type: 'color' },
      { key: 'cardOpacity', label: 'Card opacity', type: 'range', min: 0, max: 0.4, step: 0.01, percent: true },
      { key: 'cardBlur', label: 'Card blur', type: 'range', min: 0, max: 30, step: 1, unit: 'px' },
      { key: 'cornerRadius', label: 'Corner roundness', type: 'range', min: 0, max: 32, step: 1, unit: 'px' },
    ],
  },
  {
    title: 'Fun',
    fields: [
      { key: 'particles', label: 'Floating particles', type: 'select', options: PARTICLE_OPTIONS },
      { key: 'particleCount', label: 'Particle amount', type: 'range', min: 5, max: 120, step: 1 },
    ],
  },
];

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function hslToHex(h, s, l) {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomTheme(current) {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = (hue + 60 + Math.floor(Math.random() * 120)) % 360;
  const particles = PARTICLE_OPTIONS[Math.floor(Math.random() * PARTICLE_OPTIONS.length)].value;
  return {
    ...current,
    mode: Math.random() < 0.5 ? 'glow' : 'gradient',
    bgColor: hslToHex(hue, 45, 6),
    color1: hslToHex(hue, 80, 55),
    color2: hslToHex(hue2, 80, 55),
    glowStrength: 0.2 + Math.random() * 0.25,
    angle: Math.floor(Math.random() * 360),
    dim: 0.3 + Math.random() * 0.25,
    primary: hslToHex(hue, 75, 55),
    accent: hslToHex(hue2, 75, 60),
    wheelGlow: hslToHex(hue2, 80, 60),
    particles,
  };
}

function loadTheme() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...DEFAULT_THEME, ...saved } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Most likely the picture is too big for localStorage: keep everything else
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...theme, image: null }));
    } catch {
      // Storage unavailable (private mode etc.), the theme just won't persist
    }
  }
}

function backgroundFor(theme) {
  switch (theme.mode) {
    case 'gradient':
      return `linear-gradient(${theme.angle}deg, ${theme.color1}, ${theme.color2})`;
    case 'solid':
      return theme.bgColor;
    case 'image':
      return theme.image ? `center / cover no-repeat url("${theme.image}"), ${theme.bgColor}` : theme.bgColor;
    default:
      return [
        `radial-gradient(circle at 15% 10%, ${hexToRgba(theme.color1, theme.glowStrength)}, transparent 45%)`,
        `radial-gradient(circle at 85% 90%, ${hexToRgba(theme.color2, theme.glowStrength * 0.72)}, transparent 45%)`,
        theme.bgColor,
      ].join(', ');
  }
}

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#0ea5e9', '#f97316', '#14b8a6', '#facc15'];

function makeParticles(type, count) {
  return Array.from({ length: count }, (_, i) => {
    const duration = type === 'stars' ? 2 + Math.random() * 4 : 8 + Math.random() * 14;
    return {
      id: i,
      style: {
        '--x': `${Math.random() * 100}vw`,
        '--y': `${Math.random() * 100}vh`,
        '--size': `${type === 'bubbles' ? 8 + Math.random() * 28 : type === 'hearts' ? 12 + Math.random() * 16 : 2 + Math.random() * 6}px`,
        '--drift': `${(Math.random() - 0.5) * 120}px`,
        '--spin': `${(Math.random() - 0.5) * 1080}deg`,
        '--duration': `${duration}s`,
        // Negative delays spread the particles over the screen from the start
        '--delay': `${-Math.random() * duration}s`,
        '--color': CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      },
    };
  });
}

// Remount (e.g. with a new key) to regenerate the particles
function Particles({ type, count }) {
  const [particles] = useState(() => makeParticles(type, count));
  return (
    <div className={`particles particles-${type}`} aria-hidden="true">
      {particles.map((p) => (
        <span key={p.id} className="particle" style={p.style}>{type === 'hearts' ? '💗' : null}</span>
      ))}
    </div>
  );
}

// A cog button in the corner that opens the page theme settings. Also renders
// the background layer and particles, and applies the theme's CSS variables.
function ThemeSettings() {
  const [theme, setTheme] = useState(loadTheme);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => saveTheme(theme), [theme]);

  // Colors and glass are plain CSS variables used throughout App.css
  useEffect(() => {
    const vars = {
      '--bg': theme.bgColor,
      '--primary': theme.primary,
      '--primary-hover': `color-mix(in srgb, ${theme.primary} 65%, white)`,
      '--accent': theme.accent,
      '--wheel-glow': hexToRgba(theme.wheelGlow, 0.45),
      '--surface': `rgba(255, 255, 255, ${theme.cardOpacity})`,
      '--card-blur': `${theme.cardBlur}px`,
      '--radius': `${theme.cornerRadius}px`,
    };
    const style = document.documentElement.style;
    Object.entries(vars).forEach(([name, value]) => style.setProperty(name, value));
  }, [theme]);

  // Close on Escape or a click outside the panel
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onPointer(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  function update(key, value) {
    setTheme((prev) => ({ ...prev, [key]: value }));
  }

  function applyPreset(preset) {
    // Keep an uploaded picture so switching presets doesn't lose it
    setTheme((prev) => ({ ...DEFAULT_THEME, image: prev.image, ...preset.theme }));
  }

  const bgClasses = ['app-bg', `app-bg-${theme.mode}`, theme.animate && 'drift', theme.hueCycle && 'hue-cycle'].filter(Boolean).join(' ');

  return (
    <>
      <div className={bgClasses} aria-hidden="true">
        <div className="app-bg-fill" style={{ background: backgroundFor(theme), filter: theme.mode === 'image' && theme.imageBlur ? `blur(${theme.imageBlur}px)` : undefined }} />
        {(theme.mode === 'gradient' || theme.mode === 'image') && <div className="app-bg-dim" style={{ opacity: theme.dim }} />}
      </div>
      {theme.particles !== 'none' && <Particles key={`${theme.particles}-${theme.particleCount}`} type={theme.particles} count={theme.particleCount} />}

      <div className="theme-settings" ref={rootRef}>
        <button className={`theme-cog ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="theme-panel" aria-label="Theme settings" title="Theme settings">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        {open && (
          <div id="theme-panel" className="theme-panel card" role="dialog" aria-label="Theme settings">
            <div className="theme-panel-header">
              <h2>Theme</h2>
              <button className="btn-icon" onClick={() => setOpen(false)} aria-label="Close theme settings">×</button>
            </div>

            <div className="theme-presets">
              {PRESETS.map((preset) => {
                const t = { ...DEFAULT_THEME, ...preset.theme };
                return (
                  <button key={preset.name} className="theme-preset" onClick={() => applyPreset(preset)}>
                    <span className="theme-preset-swatch" style={{ background: backgroundFor({ ...t, glowStrength: Math.max(t.glowStrength, 0.6) }) }} />
                    {preset.name}
                  </button>
                );
              })}
              <button className="theme-preset" onClick={() => setTheme(randomTheme)}>
                <span className="theme-preset-swatch theme-preset-random" aria-hidden="true">🎲</span>
                Surprise me
              </button>
            </div>

            {THEME_GROUPS.map((group) => (
              <fieldset key={group.title} className="settings-group">
                <legend>{group.title}</legend>
                {group.fields
                  .filter((field) => !field.modes || field.modes.includes(theme.mode))
                  .filter((field) => field.key !== 'particleCount' || theme.particles !== 'none')
                  .map((field) => (
                    <SettingField key={field.key} idPrefix="theme" field={field} value={theme[field.key]} onChange={(value) => update(field.key, value)} />
                  ))}
              </fieldset>
            ))}

            <div className="settings-footer">
              <button className="btn btn-ghost" onClick={() => setTheme(DEFAULT_THEME)}>Reset theme</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ThemeSettings
