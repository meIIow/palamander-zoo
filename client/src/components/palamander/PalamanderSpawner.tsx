import { useState, useEffect } from 'react';

import PalamanderView from './PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { createDefaultPal } from '../../palamander/create-palamander.ts';
import { generateWindowDisplayRange } from '../../palamander/palamander-range.ts';

async function createPalsTemp(): Promise<Palamander[]> {
  return [createDefaultPal()];
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(() => {
    const getPals = async () => {
      const x = await createPalsTemp();
      console.log(x);
      setPalamanders(x);
    };
    getPals();
  }, []);

  return (
    <>
      {palamanders.length <= 0 ? null : (
        palamanders.map((pal, i) => (
          <PalamanderView
            pal={pal}
            display={generateWindowDisplayRange({ x: 0.5, y: 0.5 })}
            key={i}
          />
        ))
      )}
    </>
  );
}

export default PalamanderSpawner;
