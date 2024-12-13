import { StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'
import '../index.css'
import Palamander from '../palamander/Palamander.tsx'
import { SegmentCircle } from '../palamander/segment.ts'
import { createEngineCircle, createAxolotl } from '../palamander/create-palamander.ts'

const PALAMANDER_ROOT_ID = 'palamander-root';

function getPalamanderRootElement(): HTMLElement {
  const existingRoot = document.getElementById(PALAMANDER_ROOT_ID);
  if (existingRoot !== null) return existingRoot;

  const root = document.createElement("div");
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

function renderPalamander() {
  console.log("Rendering Palamander")
  const createSpawnCircle = (circle: SegmentCircle) => createEngineCircle(circle, {x: 400, y: 400});
  const pal = createAxolotl();
  getPalamanderRoot().render(
    <StrictMode>
      <Palamander initialSegment={pal} spawnCircle={createSpawnCircle(pal.circle)}/>
    </StrictMode>,
  )
}

function clearPalamander() {
  console.log("Clearing Palamander")
  getPalamanderRoot().render(
    <StrictMode>
      {null}
    </StrictMode>,
  )
}


document.addEventListener("visibilitychange", function() {
  if (document.hidden) {
    console.log("This was hidden, and I still got this update!");
    clearPalamander();
  } else {
    console.log("This was not hidden, and I got the event!");
    renderPalamander();
  }
}, false);

chrome.runtime.onMessage.addListener(
  function(request, _sender, _sendResponse) {
    if (request.greeting === "inject") {
      renderPalamander();
    } else if (request.greeting == "clear") {
      clearPalamander();
    }
  }
);
