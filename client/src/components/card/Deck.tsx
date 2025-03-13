import { useContext } from 'react';

import Card from './Card.tsx';
import { FilteredPalContext } from '../common/pal-context.ts';

import type { Palamander } from '../../palamander/palamander.ts';
import type { CardColor } from '../common/card-color.ts';

import { getDefaultCardColor } from '../common/card-color.ts';

type DeckProps = {
  choose: (type: string) => void;
  toUpper?: (pal: Palamander) => JSX.Element | undefined;
  toLower?: (pal: Palamander) => JSX.Element | undefined;
  blank?: boolean;
  expand: boolean;
  color?: CardColor;
};

function Deck({ choose, toUpper, toLower, blank, expand, color }: DeckProps) {
  const pals = useContext(FilteredPalContext);

  color = color ?? getDefaultCardColor();
  const cards =
    Object.keys(pals).length <= 0 ?
      null
    : pals.map((pal) => (
        <div key={pal.type}>
          <Card
            pal={pal}
            choose={choose}
            upper={toUpper?.call('', pal)}
            lower={toLower?.call('', pal)}
            expand={expand}
            color={color}
          />
        </div>
      ));
  const blankCard =
    !blank ? null : (
      <div key={'blank'}>
        <Card choose={choose} expand={expand} color={color} />
      </div>
    );

  return (
    <div className="grid grid-cols-1 240:grid-cols-2 m-2">
      {blankCard}
      {cards}
    </div>
  );
}

export default Deck;
