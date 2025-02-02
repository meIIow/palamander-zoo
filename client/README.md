# Palamander Zoo Client

Chrome Extension for the Palamander Zoo. Composed with [React](https://react.dev/) ([TypeScript](https://www.typescriptlang.org/)) and built with [Vite](https://vite.dev/).

The Chrome Extension consists of three main components:

1. A Content Script that renders Palamanders on the active Tab
2. A Popup page that can be used to view and grow your Palamander Zoo
3. A Service Worker that works as the intermediary between two, and that tracks tab changes to keep Content Script running on the active tab.

See the [Chrome Extension Docs](https://developer.chrome.com/docs/extensions) to become familiar with the core concepts.

Our code is bundled into the dist directory as browser-compatible JS by Vite. The 3 components above are configured as entrypoints (`inputs`) by `vite.config.ts`. These are placed into the output `dist` directory for the Chrome Extension (configured in `public/manifest.json`). An additional fourth `demo` entrypoint is configured for near-instand local development.

Run `npm run build` in order to populate the `dist` directory. Then you can develop locally in your browser by loading from this local directory - see https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked and https://developer.chrome.com/docs/extensions/get-started/tutorial/debug.

Sometimes it's easier to strip away the Chrome Extension ecosystem to test something out (a react component, some logic) independently. To do this, pipe the code of interest through to `src/demo.tsx` and run `npm run dev`. This will start a local development server - travel here in the browser and use the `/demo` endpoint (ex: `http://localhost:5173/demo`) to quickly iterate. You can view the `/popup` endpoint here too, although any chrome extension API logic will be broken.

NOTE: This project is currently a WIP. The Palamander React code is functional but still rough, and the Chrome Extension components are mostly boilerplate.
