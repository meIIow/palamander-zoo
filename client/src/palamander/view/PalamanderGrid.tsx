import './PalamanderGrid.css'
import { useState, useEffect } from 'react';
import PalamanderView from './PalamanderView.tsx';
import { Palamander } from '../palamander.ts';
import { SuppressMove } from '../movement/movement-agent.ts';
import { readDefaultPalList } from '../create-palamander.ts';
import { generateBoundedDisplayRange }from '../palamander-range.ts'

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderGrid({ suppress, reset } : { suppress: SuppressMove, reset: number } ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await readDefaultPalList(suppress);
      setPalamanders(x);
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