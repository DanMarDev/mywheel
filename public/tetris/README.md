# Tetris JS

[Tetris JS](https://github.com/nbarkhina/TetrisJS) by Neil Barkhina (Apache-2.0, see
`LICENSE`), served in the Tetris side drawer (`src/TetrisDrawer.jsx`).

From commit `773f3e3d544e96783e7e3c370e12cfa895e7fb43`. `config.js` (with its source map),
`favicon.ico` and `github_logo.png` are unmodified.

`index.js` has one change, in `requestNextFrame` (marked `mywheel:`): the game logic runs at a
fixed 60 ticks per second instead of once per frame, so the game speed no longer depends on the
display's refresh rate (it ran 2.75× too fast at 165 Hz). Painting still happens every frame.
`index.js.map` is the original, so line numbers after that function are slightly off in devtools.

`index.html` was adapted for embedding:

- jQuery 3.3.1, Bootstrap 4.0.0 (CSS only, its JS was unused), Rivets 0.9.6 and RequireJS
  2.3.6 are served from `vendor/` instead of CDNs. Each was checked against the cdnjs SRI
  hash, and all are MIT licensed (see the header of each file)
- Font Awesome arrow icons replaced with plain text arrows
- `window.setTetrisEnabled(bool)` pauses a running game while the drawer is closed
