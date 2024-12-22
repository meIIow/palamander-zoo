import { useState, useEffect } from 'react';

import Palamander from './Palamander.tsx';
import { Segment } from './segment.ts';
import segmentate from './segmentate.ts';
import { createEngineCircle } from './circle.ts';

async function createNewtTemp() {
  return segmentate({
    type: 'newt',
    length: 15,
    parentIndex: 0,
    size: 10,
    angle: 0,
    children: [],
  })
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const [palamanders, setPalamanders] = useState<Array<Segment>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await createNewtTemp();
      console.log(x);
      setPalamanders([x]);
    };
    getPals();
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
        <Palamander segment={pal} spawnCircle={createSpawnCircle(pal.circle.radius)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner