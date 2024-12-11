import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import Palamander from '../palamander/Palamander.tsx'
import { SegmentCircle } from '../palamander/segment.ts'
import { createEngineCircle, createAxolotl } from '../palamander/create-palamander.ts'

chrome.runtime.onMessage.addListener(
  function(request, _sender, _sendResponse) {
    if (request.greeting === "inject") {
      console.log("Rendering Palamander!");
      const root = document.createElement("div");
      root.id = 'root';
      document.body.appendChild(root);
      const createSpawnCircle = (circle: SegmentCircle) => createEngineCircle(circle, {x: 200, y: 200});
      const pal = createAxolotl();
      createRoot(root).render(
        <StrictMode>
          <Palamander initialSegment={pal} spawnCircle={createSpawnCircle(pal.circle)}/>
        </StrictMode>,
      )
    }
  }
);

console.log("Rendering Palamander!");
const root = document.createElement("div");
root.id = 'root';
document.body.appendChild(root);
const createSpawnCircle = (circle: SegmentCircle) => createEngineCircle(circle, {x: 400, y: 400});
const pal = createAxolotl();
createRoot(root).render(
  <StrictMode>
    <Palamander initialSegment={pal} spawnCircle={createSpawnCircle(pal.circle)}/>
  </StrictMode>,
)
