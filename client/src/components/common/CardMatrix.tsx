import Card from './Card.tsx';
import { useContext } from 'react';
import { FilteredPalContext } from './pal-context.ts';

function CardMatrix({ choose } : { choose: (type: string) => void } ) {
  const pals = useContext(FilteredPalContext)

  const cards = Object.keys(pals).length <= 0 ?
    null :
    pals.map((pal) => (
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
