import Deck from './Deck.tsx';

import PalamanderFilter from '../filter/PalamanderFilter.tsx';

import type { Palamander } from '../../palamander/palamander.ts';

type ViewDeckProps = {
  choose: (type: string) => void;
  expand: boolean;
};

function DeckView({ choose, expand }: ViewDeckProps) {
  const toUpper = (pal: Palamander) => (
    <div className="text-center text-base">{pal.type.toLocaleLowerCase()}</div>
  );
  const toLower = (pal: Palamander) => <PalamanderFilter type={pal.type} />;
  return (
    <div className="size-full overflow-y-auto rounded-b-md">
      <Deck
        choose={choose}
        toUpper={toUpper}
        toLower={toLower}
        expand={expand}
      />
    </div>
  );
}

export default DeckView;
