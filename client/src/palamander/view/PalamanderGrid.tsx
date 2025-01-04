import { useState, useEffect } from 'react';

import PalamanderView from './PalamanderView.tsx';

import { Palamander } from '../palamander.ts';
import { IndexedWindowRange } from '../palamander-range.ts';
import segmentate from '../morphology/segmentate.ts';
import { getPlaceholderMovementAgent, SuppressMove } from '../movement/movement-agent.ts';

const palTypes = [
  'axolotl',
  // 'newt',
  'frog',
  'centipede',
  'sea-monkey',
  'sea-lion',
  'starfish',
  'octopus',
  'crawdad',
  'horshoe-crab'
]

async function createPalList(types: string[], count: number, supressMoves: SuppressMove): Promise<Palamander[]> {
  return types.map((type, i) => {
    const mag = (type == 'crawdad' ? 10 : 20) / 2;
    return {
      head: segmentate({
        type,
        count: type == 'axolotl' ? 15 : 10,
        index: 0,
        size: 100,
        angle: 0,
        offset: 0,
        mirror: false,
        next: null,
        branches: [],
      }),
      updateInterval: 50,
      range: new IndexedWindowRange(count, Math.floor(i/count), i % count, mag, { x: 0.5, y: 0.5 }),
      movementAgent: getPlaceholderMovementAgent(supressMoves)
    }
  });
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderGrid({ supress, reset } : { supress: SuppressMove, reset: number } ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await createPalList(palTypes, Math.ceil(Math.sqrt(palTypes.length)), supress);
      setPalamanders(x);
    };
    getPals();
  }, [supress, reset]);

  return (
    <>
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <PalamanderView pal={pal} key={i}/>
      ))}
    </>
  )
}

export default PalamanderGrid