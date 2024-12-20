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
  const createSpawnCircle = (radius: number) => {
    const circle = { radius, center: { x: 0, y: 0 } };
    return createEngineCircle(circle, {x: Math.random()*h, y: Math.random()*w})
  };

  Math.random
  return (
    <>
      {palamanders.map((pal, i) => (
        <Palamander segmentSpec={pal} spawnCircle={createSpawnCircle(pal.radius)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner