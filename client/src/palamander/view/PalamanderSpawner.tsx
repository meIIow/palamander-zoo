import { useState, useEffect } from 'react';

import PalamanderView from './PalamanderView.tsx';
import { Palamander } from '../palamander.ts';
import segmentate from '../morphology/segmentate.ts';
import { createSpawnCoord } from '../common/circle.ts';
import { getPlaceholderMovementAgent } from '../movement/movement-agent.ts';

async function createAxolotlTemp(): Promise<Palamander> {
  return {
    head: segmentate({
      type: 'jellyfish',
      length: 10,
      parentIndex: 0,
      size: 100,
      angle: 0,
      seed: 0,
      children: [],
    }),
    updateInterval: 50,
    magnification: 20,
    movementAgent: getPlaceholderMovementAgent()
  };
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await createAxolotlTemp();
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
        <PalamanderView pal={pal} spawnCoord={createSpawnCoord(w, h)} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner