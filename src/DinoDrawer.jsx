import { useRef, useState, useEffect, useCallback } from 'react'

const GAME_URL = `${import.meta.env.BASE_URL}dino/index.html`;

// A slide-out side drawer with Chrome's Dino Run game (served from public/dino/).
// The game runs in an iframe so its global script and styles stay isolated.
function DinoDrawer() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);
  const tabRef = useRef(null);

  // The game only accepts input while the drawer is open (see public/dino/index.html),
  // so keys pressed on the main page never reach it while it's closed.
  const syncGame = useCallback(() => {
    const game = frameRef.current?.contentWindow;
    if (!game) return;
    game.setDinoEnabled?.(open);
    game.onDinoEscape = () => setOpen(false);
    if (open) game.focus();
  }, [open]);

  useEffect(() => {
    syncGame();
    // When closing, move focus out of the game back to the main page
    if (!open && document.activeElement === frameRef.current) {
      tabRef.current?.focus();
    }
  }, [open, syncGame]);

  // While the drawer is open, every key press belongs to the game: if focus has
  // wandered back to the main page, block the key there, forward it to the game
  // and refocus the game. Escape closes the drawer.
  useEffect(() => {
    if (!open) return;

    function isolateKey(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.type === 'keydown' && e.key === 'Escape') {
        setOpen(false);
        return;
      }
      const game = frameRef.current?.contentWindow;
      game?.dinoKey?.(e.type, e.keyCode);
      if (e.type === 'keydown') game?.focus();
    }

    const types = ['keydown', 'keyup', 'keypress'];
    types.forEach((type) => window.addEventListener(type, isolateKey, true));
    return () => types.forEach((type) => window.removeEventListener(type, isolateKey, true));
  }, [open]);

  function toggle() {
    setOpen((o) => !o);
    setLoaded(true);
  }

  return (
    <aside className={`dino-drawer ${open ? 'open' : ''}`} aria-label="Dino Run game">
      <button ref={tabRef} className="dino-tab" onClick={toggle} aria-expanded={open} aria-controls="dino-panel">
        <span aria-hidden="true">🦖</span>
        <span className="dino-tab-label">{open ? 'Close' : 'Dino Run'}</span>
      </button>
      <div id="dino-panel" className="dino-panel card" inert={!open}>
        <div className="dino-header">
          <h2>Dino Run</h2>
          <button className="btn-icon" onClick={toggle} aria-label="Close Dino Run">×</button>
        </div>
        <div className="dino-screen">
          {loaded && (
            <iframe
              ref={frameRef}
              src={GAME_URL}
              title="Dino Run"
              onLoad={syncGame}
            />
          )}
        </div>
        <p className="dino-help">
          <kbd>Space</kbd> / <kbd>↑</kbd> jump · <kbd>↓</kbd> duck · tap to jump on touch screens.
          While open, the keyboard only controls the game. <kbd>Esc</kbd> closes it.
        </p>
        <p className="dino-credit">
          From <a href="https://github.com/wayou/t-rex-runner" target="_blank" rel="noreferrer">wayou/t-rex-runner</a> (Chromium, BSD-3-Clause)
        </p>
      </div>
    </aside>
  );
}

export default DinoDrawer
