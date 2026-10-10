# mywheel

A customizable spin-the-wheel website. Add your own options, spin, and let the wheel decide.

**Live site:** https://danmardev.github.io/mywheel/

> [!NOTE]
> **This website was developed with AI assistance.** Much of the code, styling and
> documentation was written with [Claude Code](https://claude.com/claude-code)
> (Anthropic's Claude Opus 5.5 model), directed and reviewed by the repository owner.

## Features

- Add, edit and remove wheel items
- Collapsible **Wheel Settings** panel covering every option of the wheel library: colors,
  lines, size, label styling, spin physics, pointer angle, images and more
- Sounds: background sounds while spinning, a tick as each item passes the pointer, and a
  sound when the wheel stops (bring your own audio files, or use the built-in tick)
- Congratulations animation with confetti when the wheel lands on a result
- A **Dino Run** game in a slide-out side drawer (🦖 tab on the right). While it's open, the
  keyboard only controls the game; press <kbd>Esc</kbd> to close it
- A **Doom-3D** first-person shooter in a wider drawer (👹 tab below Dino Run), with a full-screen
  button
- **Tetris** in a third drawer (🧱 tab below Doom). Only one game drawer is open at a time, and
  Doom and Tetris pause while their drawer is closed
- A **theme** cog in the top-right corner: background presets, glow / gradient / solid / picture
  backgrounds, accent colors, glass effect, corner roundness and floating particles. The theme
  is saved in your browser

Uploaded wheel images and sounds stay in your browser and are cleared when the page reloads.
A theme background picture is saved with the theme, unless it's too large for browser storage.

## Packages and projects used

### Runtime packages (npm)

| Package | Version | License | Used for |
| --- | --- | --- | --- |
| [react](https://react.dev) | 19.3.0 | MIT | UI framework |
| [react-dom](https://react.dev) | 19.3.0 | MIT | Rendering React to the page |
| [spin-wheel](https://github.com/CrazyTim/spin-wheel) | 5.0.2 | MIT | The spinning wheel itself |

### Development packages (npm)

| Package | Version | License | Used for |
| --- | --- | --- | --- |
| [vite](https://vite.dev) | 8.3.0 | MIT | Dev server and production build |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | 6.1.1 | MIT | React support for Vite |
| [eslint](https://eslint.org) | 10.10.0 | MIT | Linting |
| [@eslint/js](https://github.com/eslint/eslint) | 10.0.1 | MIT | ESLint recommended rules |
| [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) | 7.1.1 | MIT | React Hooks lint rules |
| [eslint-plugin-react-refresh](https://github.com/ArnaudBarre/eslint-plugin-react-refresh) | 0.5.7 | MIT | Fast Refresh lint rules |
| [globals](https://github.com/sindresorhus/globals) | 17.12.0 | MIT | Browser globals for ESLint |
| [@types/react](https://github.com/DefinitelyTyped/DefinitelyTyped) | 19.3.0 | MIT | Editor type hints |
| [@types/react-dom](https://github.com/DefinitelyTyped/DefinitelyTyped) | 19.3.0 | MIT | Editor type hints |

### Other projects and assets

| Project | License | Used for |
| --- | --- | --- |
| [wayou/t-rex-runner](https://github.com/wayou/t-rex-runner) (commit `5455bfa`), extracted from [Chromium](https://www.chromium.org)'s offline "T-Rex" game | BSD-3-Clause | The Dino Run game in [`public/dino/`](public/dino/). Its `index.js`, `index.css` and `assets/` are unmodified; `index.html` was adapted for embedding. See [`public/dino/LICENSE`](public/dino/LICENSE) |
| [Doom-3D](https://github.com/pannilal/Doom) by Praneel Singh (commit `1ca9c39`) | Apache-2.0 | The Doom game in [`public/doom/`](public/doom/), a production build with small embedding changes (hash routing, pause hook). See [`public/doom/README.md`](public/doom/README.md), [`public/doom/mywheel.patch`](public/doom/mywheel.patch) and [`public/doom/LICENSE`](public/doom/LICENSE) |
| [Tetris JS](https://github.com/nbarkhina/TetrisJS) by Neil Barkhina (commit `773f3e3`) | Apache-2.0 | The Tetris game in [`public/tetris/`](public/tetris/). The game scripts are unmodified; `index.html` was adapted for embedding. It uses jQuery 3.3.1, Bootstrap 4.0.0 (CSS), Rivets 0.9.6 and RequireJS 2.3.6 (all MIT), served from [`public/tetris/vendor/`](public/tetris/vendor/). See [`public/tetris/README.md`](public/tetris/README.md) and [`public/tetris/LICENSE`](public/tetris/LICENSE) |
| [Inter](https://rsms.me/inter/) font via [Google Fonts](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 | Site typography |
| [spin-wheel README](https://github.com/CrazyTim/spin-wheel) | MIT | Copied to [`src/spin-wheel-instructions.md`](src/spin-wheel-instructions.md) as an API reference |

### Tools

| Tool | Used for |
| --- | --- |
| [Claude Code](https://claude.com/claude-code) by Anthropic | AI-assisted development |
| [GitHub Actions](https://github.com/features/actions) + [GitHub Pages](https://pages.github.com) | Building and hosting the site ([workflow](.github/workflows/deploy.yml)) |

## Running locally

Requires [Node.js](https://nodejs.org) 20.19+ or 22.12+.

```sh
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
```

## Deployment

Every push to `main` builds the site and publishes it to GitHub Pages using
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). In the repository settings,
**Pages → Source** must be set to **GitHub Actions**.
