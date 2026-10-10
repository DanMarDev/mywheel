import { useRef, useEffect, useState } from 'react'
import { Wheel } from 'spin-wheel'
import WheelSettings from './WheelSettings'
import Confetti from './Confetti'
import DinoDrawer from './DinoDrawer'
import { DEFAULT_SETTINGS } from './wheelDefaults'
import { useSpinSound } from './useSpinSound'
import './App.css'

const DEFAULT_LABELS = ['one', 'two', 'three'];

// Settings handled by the app rather than passed straight to the wheel
const APP_ONLY_SETTINGS = new Set([
  'spinSpeed', 'offsetX', 'offsetY', 'rotation',
  'image', 'imageOpacity', 'overlayImage',
  'spinSounds', 'spinSoundMode', 'spinSoundVolume', 'spinSoundLoop', 'stopSound',
  'tickEnabled', 'tickSound', 'tickVolume',
]);

function loadImage(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Returns the loaded HTMLImageElement for a URL, or null while loading / when empty
function useLoadedImage(url) {
  const [image, setImage] = useState(null);
  useEffect(() => {
    let cancelled = false;
    loadImage(url).then((img) => {
      if (!cancelled) setImage(img);
    });
    return () => { cancelled = true; };
  }, [url]);
  return image;
}

// Build the wheel's items. The library's own `image` prop is drawn on top of
// everything and stretched to a square, so instead the wheel image is given to
// every item: centred on the wheel, counter-rotated by the item's angle and
// scaled to cover the wheel. Each item clips it to its own slice, so together
// they form one round image underneath the lines and labels.
function buildItems(labels, image, { radius, imageOpacity }) {
  const sliceAngle = 360 / labels.length;
  return labels.map((label, i) => ({
    label,
    ...(image && {
      image,
      imageRadius: 0,
      imageRotation: -(i + 0.5) * sliceAngle,
      // Item images are sized relative to a 500px container (see spin-wheel docs)
      imageScale: (500 * radius) / Math.min(image.width, image.height),
      imageOpacity,
    }),
  }));
}

function App() {
  const containerRef = useRef(null)
  const wheel = useRef(null);

  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [result, setResult] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const wheelImage = useLoadedImage(settings.image);
  const overlayImage = useLoadedImage(settings.overlayImage);
  const spinSound = useSpinSound({
    sounds: settings.spinSounds,
    mode: settings.spinSoundMode,
    volume: settings.spinSoundVolume,
    loop: settings.spinSoundLoop,
    stopSound: settings.stopSound,
    tickEnabled: settings.tickEnabled,
    tickSound: settings.tickSound,
    tickVolume: settings.tickVolume,
  });

  useEffect(() => {
    if (containerRef.current && !wheel.current) {
      // 1. Configure the wheel's properties:
      const props = {
        items: labels.map((label) => ({ label })),
        onRest: (e) => {
          spinSound.finish();
          setResult(wheel.current.items[e.currentIndex]?.label ?? null);
        },
        onSpin: () => {
          setResult(null);
          spinSound.start(wheel.current);
        },
        // Also raised when items or settings change, so only tick while the wheel is moving
        onCurrentIndexChange: () => {
          const w = wheel.current;
          if (w && (w.rotationSpeed !== 0 || w.isDragging)) spinSound.tick();
        },
      }
      wheel.current = new Wheel(containerRef.current, props);
    }
  }, []);

  // Keep the wheel's items in sync with the labels and wheel image
  const { radius, imageOpacity } = settings;
  useEffect(() => {
    if (wheel.current) {
      wheel.current.items = buildItems(labels, wheelImage, { radius, imageOpacity });
    }
  }, [labels, wheelImage, radius, imageOpacity]);

  useEffect(() => {
    if (wheel.current) wheel.current.overlayImage = overlayImage;
  }, [overlayImage]);

  // Keep the wheel's properties in sync with the settings
  useEffect(() => {
    if (!wheel.current) return;
    const wheelProps = Object.fromEntries(
      Object.entries(settings).filter(([key]) => !APP_ONLY_SETTINGS.has(key))
    );
    Object.assign(wheel.current, wheelProps);
    wheel.current.offset = { x: settings.offsetX, y: settings.offsetY };
  }, [settings]);

  // Only set rotation when it changes, so other settings don't snap the wheel back
  useEffect(() => {
    if (wheel.current) wheel.current.rotation = settings.rotation;
  }, [settings.rotation]);

  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    for (const url of [settings.image, settings.overlayImage, settings.stopSound?.url, settings.tickSound?.url, ...settings.spinSounds.map((s) => s.url)]) {
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    }
    setSettings(DEFAULT_SETTINGS);
  }

  function updateLabel(index, value) {
    setLabels((prev) => prev.map((label, i) => (i === index ? value : label)));
  }

  function addItem() {
    setLabels((prev) => [...prev, `item ${prev.length + 1}`]);
  }

  function removeItem(index) {
    setLabels((prev) => prev.filter((_, i) => i !== index));
  }

  function resetLabels() {
    setLabels(DEFAULT_LABELS);
    setResult(null);
  }

  function spin() {
    setResult(null);
    wheel.current.spin(settings.spinSpeed);
  }

  function stop() {
    // Wheel.stop() doesn't raise onRest, so finish the spin sounds here
    if (wheel.current.rotationSpeed === 0) return;
    wheel.current.stop();
    spinSound.finish();
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="logo">mywheel<span>.js</span></h1>
        <p className="tagline">Add your options, spin, and let the wheel decide.</p>
      </header>

      <div className="layout">
        <section className="card wheel-card">
          <div className="wheel-wrapper">
            <div className="wheel-pointer-track" style={{ transform: `rotate(${settings.pointerAngle}deg)` }} aria-hidden="true">
              <div className="wheel-pointer" />
            </div>
            <div className="wheel-container" ref={containerRef} />
          </div>
          <div className="result-wrapper">
            {result !== null && <Confetti colors={settings.itemBackgroundColors} />}
            <p className={`result ${result !== null ? 'visible' : ''}`} aria-live="polite">
              {result !== null && (
                <>
                  <span className="result-congrats">🎉 Congratulations! 🎉</span>
                  <span>Result: <strong>{result}</strong></span>
                </>
              )}
            </p>
          </div>
          <div className="button-container">
            <button className="btn btn-primary" onClick={spin}>Spin</button>
            <button className="btn btn-secondary" onClick={stop}>Stop</button>
          </div>
        </section>

        <section className="card wheel-settings">
          <div className="settings-header">
            <h2>Wheel Items</h2>
            <span className="count">{labels.length}</span>
          </div>
          <ul className="item-list">
            {labels.map((label, index) => (
              <li key={index} className="item-row">
                <span className="swatch" style={{ background: settings.itemBackgroundColors[index % settings.itemBackgroundColors.length] }} />
                <label className="visually-hidden" htmlFor={`item${index + 1}`}>Item {index + 1}</label>
                <input id={`item${index + 1}`} type="text" placeholder={`Item ${index + 1}`} value={label} onChange={(e) => updateLabel(index, e.target.value)} />
                <button className="btn-icon" onClick={() => removeItem(index)} disabled={labels.length <= 1} aria-label={`Remove item ${index + 1}`}>×</button>
              </li>
            ))}
          </ul>
          <div className="settings-actions">
            <button className="btn btn-add" onClick={addItem}>+ Add Item</button>
            <button className="btn btn-ghost" onClick={resetLabels}>Reset</button>
          </div>
        </section>
      </div>

      <WheelSettings settings={settings} onChange={updateSetting} onReset={resetSettings} />

      <DinoDrawer />
    </main>
  )
}

export default App
