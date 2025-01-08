import { useState, useEffect } from 'react';

import PalamanderView from './PalamanderView.tsx';
import { Palamander, calculatePivotIndex } from '../palamander.ts';
import { IndexedWindowRange } from '../palamander-range.ts';
import segmentate from '../morphology/segmentate.ts';
import { createSpawnMult } from '../common/circle.ts';
import { getPlaceholderMovementAgent } from '../movement/movement-agent.ts';

async function createPalsTemp(): Promise<Palamander[]> {
  const body = segmentate({
    type: 'sea-lion',
    count: 10,
    index: 0,
    size: 100,
    angle: 0,
    offset: 0,
    mirror: false,
    next: null,
    branches: [],
  });
  return [
    {
      body,
      pivotIndex: calculatePivotIndex(body),
      updateInterval: 50,
      range: new IndexedWindowRange(1, 0, 0, 20, createSpawnMult()),
      movementAgent: getPlaceholderMovementAgent()
    },
  ];
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await createPalsTemp();
      console.log(x);
      setPalamanders(x);
    };
    getPals();
  }, []);

  return (
    <>
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <PalamanderView pal={pal} key={i}/>
      ))}
    </>
  )
}

export default PalamanderSpawner