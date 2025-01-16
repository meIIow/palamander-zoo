import { PalamanderSpec, hydrate } from '../../palamander/create-palamander.ts';
import Card from './Card.tsx';
import { useState, useEffect } from 'react';
import { Palamander } from '../../palamander/palamander.ts';

type CardProps = {
  pals: PalamanderSpec[],
}

function CardMatrix({ pals } : CardProps ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(() => []);

  useEffect(()=> {
    if (pals.length > 0) {
      const hydratedPals = pals.map((pal) => hydrate(pal)).map((pal) => {
        return { ...pal, override: { ...pal.override, freeze: true } }
      });
      setPalamanders(hydratedPals);
    }
  }, [pals]);
  return (
    <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
      {palamanders.length <= 0 ? null : palamanders.map((pal, i) => (
        <div key={i}>
          <Card pal={pal}/>
        </div>
      ))}
    </div>
  )
}

export default CardMatrix
