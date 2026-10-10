import GameDrawer from './GameDrawer'

const BASE = import.meta.env.BASE_URL;

// Freezes the game loop and pauses the music (see public/doom/README.md), and
// releases the mouse when the drawer closes
function setGameEnabled(game, open) {
  game.setDoomEnabled?.(open);
  if (!open) game.document.exitPointerLock?.();
}

// While the mouse is captured, Esc only releases it
function canEscapeClose(game) {
  return !game.document.pointerLockElement;
}

// Doom-3D, a prebuilt copy in public/doom/
function DoomDrawer({ open, onOpenChange }) {
  return (
    <GameDrawer
      id="doom"
      name="Doom"
      icon="👹"
      className="doom-drawer"
      src={`${BASE}doom/index.html`}
      open={open}
      onOpenChange={onOpenChange}
      setGameEnabled={setGameEnabled}
      canEscapeClose={canEscapeClose}
      fullscreen
      help={
        <>
          Click the game to capture the mouse. <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> move ·
          mouse looks · <kbd>Space</kbd> shoots. <kbd>Esc</kbd> releases the mouse, press it again to close.
        </>
      }
      credit={
        <>
          <a href="https://github.com/pannilal/Doom" target="_blank" rel="noreferrer">Doom-3D</a> by Praneel Singh
          (<a href={`${BASE}doom/LICENSE`} target="_blank" rel="noreferrer">Apache-2.0</a>)
        </>
      }
    />
  );
}

export default DoomDrawer
