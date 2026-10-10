import { useRef, useState, useEffect, useCallback } from 'react'

// A slide-out side drawer that runs a game from public/ in an iframe, loaded the
// first time the drawer opens. `setGameEnabled(gameWindow, open)` lets the game
// pause itself while the drawer is closed, and `canEscapeClose(gameWindow)` can
// stop Esc from closing the drawer (e.g. while it releases a captured mouse).
// Both must be stable functions (defined outside the component).
function GameDrawer({
  id, name, icon, className, src, open, onOpenChange: setOpen,
  setGameEnabled, canEscapeClose, fullscreen = false, help, credit,
}) {
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(null);
  const tabRef = useRef(null);

  const syncGame = useCallback(() => {
    const game = frameRef.current?.contentWindow;
    if (!game) return;
    setGameEnabled?.(game, open);
    if (open) game.focus();
  }, [open, setGameEnabled]);

  useEffect(() => {
    syncGame();
    // When closing, move focus out of the game back to the main page
    if (!open && document.activeElement === frameRef.current) {
      tabRef.current?.focus();
    }
  }, [open, syncGame]);

  // Esc inside the game closes the drawer
  function handleLoad() {
    const game = frameRef.current.contentWindow;
    game.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (!canEscapeClose || canEscapeClose(game))) setOpen(false);
    });
    syncGame();
  }

  // While open, keys pressed on the main page (e.g. after clicking the drawer
  // header) would hit the page's buttons, so send focus back to the game instead.
  // Tab still works so the drawer's own buttons stay reachable.
  useEffect(() => {
    if (!open) return;

    function redirectKey(e) {
      if (e.key === 'Tab') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      frameRef.current?.contentWindow?.focus();
    }

    window.addEventListener('keydown', redirectKey, true);
    return () => window.removeEventListener('keydown', redirectKey, true);
  }, [open, setOpen]);

  // Load the game the first time the drawer opens
  if (open && !loaded) setLoaded(true);

  function toggle() {
    setOpen(!open);
  }

  const panelId = `${id}-panel`;

  return (
    <aside className={`side-drawer ${className} ${open ? 'open' : ''}`} aria-label={`${name} game`}>
      <button ref={tabRef} className="side-tab" onClick={toggle} aria-expanded={open} aria-controls={panelId}>
        <span aria-hidden="true">{icon}</span>
        <span className="side-tab-label">{open ? 'Close' : name}</span>
      </button>
      <div id={panelId} className="side-panel card" inert={!open}>
        <div className="side-header">
          <h2>{name}</h2>
          {fullscreen && (
            <button className="btn btn-ghost btn-small" onClick={() => frameRef.current?.requestFullscreen()} disabled={!loaded}>
              Full screen
            </button>
          )}
          <button className="btn-icon" onClick={toggle} aria-label={`Close ${name}`}>×</button>
        </div>
        <div className="game-screen">
          {loaded && (
            <iframe
              ref={frameRef}
              src={src}
              title={name}
              allow="fullscreen; autoplay; gamepad"
              onLoad={handleLoad}
            />
          )}
        </div>
        <p className="side-help">{help}</p>
        <p className="side-credit">{credit}</p>
      </div>
    </aside>
  );
}

export default GameDrawer
