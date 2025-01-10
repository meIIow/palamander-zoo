import { useState, useEffect } from 'react';
import PalamanderView from './PalamanderView.tsx';
import { Palamander } from '../palamander.ts';
import { SuppressMove } from '../movement/movement-agent.ts';
import { createDefaultPalList } from '../create-palamander.ts';

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderGrid({ supress, reset } : { supress: SuppressMove, reset: number } ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const x = await createDefaultPalList(supress);
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