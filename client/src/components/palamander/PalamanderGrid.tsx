import './PalamanderGrid.css'
import { useState, useEffect } from 'react';
import PalamanderView from './PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { MovementOverride } from '../../palamander/movement/movement-agent.ts';
import { readDefaultPalList } from '../../palamander/create-palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderGrid({ suppress, reset } : { suppress: { turn: boolean, speed: boolean }, reset: number } ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const movementOverride: MovementOverride = {
        linear: { velocity: suppress.speed ? 0 : undefined },
        rotational: { velocity: suppress.turn ? 0 : undefined },
      }
      const pals = (await readDefaultPalList()).map((pal) => {
        return { ...pal, override: { ... pal.override, move: movementOverride } }
      });
      setPalamanders(pals);
    };
    getPals();
  }, [suppress, reset]);

  const dimensionCount = Math.pow(palamanders.length, 0.5);
  const cols = Math.min(Math.ceil(dimensionCount), 12);
  let rows = Math.min(Math.floor(dimensionCount), 12);
  if (cols * rows < palamanders.length) rows = cols;

  return (
    <div className={`min-h-screen min-w-screen grid grid-rows-${rows} grid-cols-${cols} gap-4`}>
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <div className=" border border-black cell" key={i}>
          <PalamanderView pal={pal} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })} key={i}/>
        </div>
      ))}
    </div>
  )
}

export default PalamanderGrid