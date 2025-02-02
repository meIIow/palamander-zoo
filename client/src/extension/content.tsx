import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import './content.css';
import PalamanderView from '../components/palamander/PalamanderView.tsx';
import { Palamander } from '../palamander/palamander.ts';
import { hydrate } from '../palamander/create-palamander.ts';
import { generateWindowDisplayRange } from '../palamander/palamander-range.ts';
import { visible, getExhibit, getPalMap, exhibitChanged } from './storage.ts';

const PALAMANDER_ROOT_ID = 'palamander-root';

function getPalamanderRootElement(): HTMLElement {
  const existingRoot = document.getElementById(PALAMANDER_ROOT_ID);
  if (existingRoot !== null) return existingRoot;

  const root = document.createElement('div');
  root.id = PALAMANDER_ROOT_ID;
  document.body.appendChild(root);
  return root;
}

const getPalamanderRoot = (() => {
  let root: Root;
  return () => {
    root = root ?? createRoot(getPalamanderRootElement());
    return root;
  };
})();

// async function createAxolotlTemp(): Promise<Palamander> {
//   return createAxolotl();
// }

const [renderPalamander, clearPalamander] = (() => {
  let rendered = false; // protect rendered variable in closure
  let pals: Array<Palamander | null> = [null, null, null];
  const palMapPromise = getPalMap();
  const updatePals: (palTypes: string[]) => Promise<void> = async (
    palTypes,
  ) => {
    const palMap = await palMapPromise;
    pals = pals.map((pal, i) => {
      const modified = pal == null ? !!palTypes[i] : pal.type != palTypes[i];
      if (!modified) return pals[i];
      return !!palTypes[i] ? hydrate(palMap[palTypes[i]]) : null;
    });
  };
  const clearPalamander = () => {
    if (rendered == false) return;
    rendered = false;
    console.log('PALAMANDER: clearing pal');
    getPalamanderRoot().render(<StrictMode>{null}</StrictMode>);
  };
  const renderPalamander = async (rerender: boolean = true) => {
    if (!(await visible())) return clearPalamander();
    if (rendered && !rerender) return;
    if (document.hidden) return;
    rendered = true;
    console.log('PALAMANDER: (re-)rendering pal');
    await updatePals(await getExhibit());
    const palViews = pals.map((pal, i) => {
      if (pal == null) return null;
      return (
        <PalamanderView
          pal={{ ...pal }}
          key={`${i}-${pal.type}`}
          display={generateWindowDisplayRange({ x: 0.5, y: 0.5 })}
        />
      );
    });
    getPalamanderRoot().render(<StrictMode>{palViews}</StrictMode>);
  };
  return [renderPalamander, clearPalamander];
})();

// Pal Render/Clear LifeCycle:
//
// Pals should (RE-)RENDER or CLEAR if any of these conditions occur:
// 1. The tab becomes visible/hidden - meaning that the user has navigated to/from the tab.
//    If it is now visible, the previous Pals should have been cleared already, but...
//    either way, we RENDER a new set of Pals.
//    If it is now hidden, we CLEAR the Pals.
// 2. The tab is loaded.
//    In this case, a new tab is opened or a tab is refreshed, so we RENDER new Pals.
// 3. The Pal behavior settings have changed (eg, frame rate / speed, movement pattern, etc).
//    In this case, the local storage will have been changed as a response to UI input.
//    We RENDER pals to replace the existing ones.
//    This should update their behavior without resetting their positions/state.
// 4. The Pal roam toggle has been changed.
//    In this case, the corresponding local storage key will change.
//    If it is now true, we RENDER - if false, we CLEAR.
// 5. The background worker explicitly tells it to RENDER
//    This may be necessary if the content script didn't run on tab load...
//    which may happen if the extension was installed/enabled after the tab was opened, etc.

// Case 1
document.addEventListener(
  'visibilitychange',
  async function () {
    if (document.hidden) {
      console.log('PALAMANDER: tab is now hidden');
      clearPalamander();
    } else {
      console.log('PALAMANDER: tab is now visible');
      await renderPalamander(true); // if Pals are already shown, respawn them.
    }
  },
  false,
);

// Case 3 or 4
chrome.storage.onChanged.addListener(async (changes) => {
  if (exhibitChanged(changes)) await renderPalamander(true);
});

// Case 5
chrome.runtime.onMessage.addListener(
  async function (request, _sender, _sendResponse) {
    if (request.greeting === 'show') {
      await renderPalamander();
    }
  },
);

// Case 2. (for render)
// Run on script injection, so Pals will show up in new and refreshed tabs.
// If still hidden when this runs, then will render from Case 1 (tab becomes visible)...
//    although there's maybe potential for a race case here
(async () => await renderPalamander(false))();
