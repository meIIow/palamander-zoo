import { useState, useEffect } from 'react';

import Palamander from './Palamander.tsx'
import { SegmentCircle, SegmentSpec } from './segment.ts'
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
  createAxolotl,
  getAxolotl
} from './create-palamander.ts'

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const [palamanders, setPalamanders] = useState<Array<SegmentSpec>>(() => []);

  // const palamanders = [
  //   // createTadpole(),
  //   // createCentipede(),
  //   // createJelly(),
  //   // createOctopus(),
  //   // createStarfish(),
  //   // createHorseshoeCrab(),
  //   // createNewt(),
  //   // createCrawdad(),
  //   // createAxolotl()
  //   await getAxolotl()
  // ];

  useEffect(()=> {
    const getPals = async () => {
      const x = await getAxolotl();
      console.log(x);
      setPalamanders([x]);
    };

    getPals();

    // const intervalId = setInterval(async () => {
    //   console.log(palamanders[0]);
    //   await getPals();
    // }, 2000);
    // return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  const h = window.innerHeight;
  const w = window.innerWidth;
  const createSpawnCircle = (radius: number) => {
    const circle = { radius, center: { x: 0, y: 0 } };
    return createEngineCircle(circle, {x: Math.random()*h, y: Math.random()*w})
  };

  return (
    <>
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <Palamander segmentSpec={pal} spawnCircle={createSpawnCircle(pal.radius)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner