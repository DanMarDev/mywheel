# Doom-3D

Production build of [Doom-3D](https://github.com/pannilal/Doom) by Praneel Singh
(Apache-2.0, see `LICENSE`), served in the Doom side drawer (`src/DoomDrawer.jsx`).

Built from commit `1ca9c39b5fe248401cebc9deca682bd1d29d2b3c` with the changes in
`mywheel.patch`:

- `HashRouter` and `"homepage": "."` so it runs from `/mywheel/doom/`
- `window.setDoomEnabled(bool)` freezes the game loop and pauses the music while the drawer is closed

To rebuild: clone the repo at that commit, `git apply mywheel.patch`, then
`npm ci && GENERATE_SOURCEMAP=false npm run build` and copy `build/index.html`,
`build/favicon.ico`, `build/logo192.png`, `build/manifest.json` and `build/static/` here.
