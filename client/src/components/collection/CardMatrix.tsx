import Card from './Card.tsx';
import { useState, useEffect } from 'react';
import { Palamander } from '../../palamander/palamander.ts';

type CardProps = {
  pals: Palamander[],
  choose: (type: string) => void,
}

function CardMatrix({ pals, choose } : CardProps ) {
  const [palamanders, setPalamanders] = useState<Array<Palamander>>(pals);

  useEffect(()=> {
    setPalamanders(pals);
  }, [pals]);

  const cards = Object.keys(palamanders).length <= 0 ?
    null :
    palamanders.map((pal) => (
      <div key={pal.type}>
        <Card pal={pal} choose={choose}/>
      </div>
    ));

  return (
    <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
      {cards}
    </div>
  )
}

export default CardMatrix
