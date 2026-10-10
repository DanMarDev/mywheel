import GameDrawer from './GameDrawer'

const BASE = import.meta.env.BASE_URL;

// Pauses a running game when the drawer closes (see public/tetris/README.md)
function setGameEnabled(game, open) {
  game.setTetrisEnabled?.(open);
}

// Tetris JS, in public/tetris/
function TetrisDrawer({ open, onOpenChange }) {
  return (
    <GameDrawer
      id="tetris"
      name="Tetris"
      icon="🧱"
      className="tetris-drawer"
      src={`${BASE}tetris/index.html`}
      open={open}
      onOpenChange={onOpenChange}
      setGameEnabled={setGameEnabled}
      help={
        <>
          <kbd>←</kbd> <kbd>→</kbd> move · <kbd>↓</kbd> soft drop · <kbd>↑</kbd> rotate · <kbd>A</kbd> hard drop ·
          {' '}<kbd>P</kbd> pause · <kbd>N</kbd> new game. Closing the drawer pauses the game. <kbd>Esc</kbd> closes it.
        </>
      }
      credit={
        <>
          <a href="https://github.com/nbarkhina/TetrisJS" target="_blank" rel="noreferrer">Tetris JS</a> by Neil Barkhina
          (<a href={`${BASE}tetris/LICENSE`} target="_blank" rel="noreferrer">Apache-2.0</a>)
        </>
      }
    />
  );
}

export default TetrisDrawer
