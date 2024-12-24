import { useState, useEffect } from 'react';

import Palamander from './Palamander.tsx';
import { Segment } from './segment.ts';
import segmentate from './segmentate.ts';
import { createSpawnCoord } from './circle.ts';

async function createNewtTemp() {
  return segmentate({
    type: 'axolotl',
    length: 15,
    parentIndex: 0,
    size: 100,
    angle: 0,
    seed: 0,
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
  return (
    <>
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <Palamander segment={pal} spawnCoord={createSpawnCoord(w, h)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner