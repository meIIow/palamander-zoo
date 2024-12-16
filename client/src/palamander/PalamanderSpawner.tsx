import Palamander from './Palamander.tsx'
import { SegmentCircle } from './segment.ts'
import {
  createEngineCircle,
  createTadpole,
  createCentipede,
  createJelly,
  createOctopus,
  createStarfish,
  createHorseshoeCrab,
  createNewt,
  createCrawdad,
  createAxolotl
} from './create-palamander.ts'

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const palamanders = [
    createTadpole(),
    createCentipede(),
    createJelly(),
    createOctopus(),
    createStarfish(),
    createHorseshoeCrab(),
    createNewt(),
    createCrawdad(),
    createAxolotl()
  ];

  const h = window.innerHeight;
  const w = window.innerWidth;
  const createSpawnCircle = (circle: SegmentCircle) => createEngineCircle(circle, {x: Math.random()*h, y: Math.random()*w});

  Math.random
  return (
    <>
      {palamanders.map((pal, i) => (
        <Palamander initialSegment={pal} spawnCircle={createSpawnCircle(pal.circle)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner