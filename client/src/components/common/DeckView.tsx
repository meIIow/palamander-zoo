import Deck from './Deck.tsx';

import PalamanderFilter from '../filter/PalamanderFilter.tsx';

import type { Palamander } from '../../palamander/palamander.ts';

type ViewDeckProps = {
  choose: (type: string) => void;
  expand: boolean;
};

function DeckView({ choose, expand }: ViewDeckProps) {
  const toUpper = (pal: Palamander) => <div>{pal.type}</div>;
  const toLower = (pal: Palamander) => <PalamanderFilter type={pal.type} />;
  const cursor = 'zoom-in';
  return (
    <div className="h-full overflow-y-auto rounded-md shade">
      <Deck
        choose={choose}
        toUpper={toUpper}
        toLower={toLower}
        expand={expand}
        cursor={cursor}
      />
    </div>
  );
}

export default DeckView;
