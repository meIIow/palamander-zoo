import { useState, useContext, useEffect } from 'react';

import DeckView from '../common/DeckView.tsx';
import Details from './Details.tsx';
import PrimaryFilter from '../common/PrimaryFilter.tsx';
import { FilteredPalContext } from '../common/pal-context.ts';

const BG_COLLECTION_SECT = '';

function Collection() {
  const [chosen, setChosen] = useState(-1); // chosen index
  const [expand, setExpand] = useState(false); // chosen index
  const pals = useContext(FilteredPalContext);
  const [bios, setBios] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const rawData = await fetch('./../bio.json');
      const bios: Record<string, string> = JSON.parse(await rawData.text());
      setBios(bios);
    })();
  }, []);

  const choose = (type: string): void => {
    setChosen(pals.findIndex((pal) => pal.type == type));
  };

  const release = (): void => setChosen(-1);
  const shift = (index: number): void => setChosen(index);

  const content =
    chosen >= 0 && chosen < pals.length ?
      <Details
        pal={pals[chosen]}
        bio={bios[pals[chosen].type]}
        index={chosen}
        count={pals.length}
        release={release}
        shift={shift}
      />
    : <DeckView choose={choose} expand={expand} />;

  return (
    <div className="flex flex-col size-full gap-4">
      <div
        className={`w-full flex flex-col basis-20 grow-0 shrink-0 ${BG_COLLECTION_SECT}`}
      >
        <div className={`flex justify-evenly flex-1`}>
          <div>Specimens</div>
          <div>Chimeras</div>
        </div>
        <div className={`flex justify-stretch flex-1`}>
          <div
            className={`items-stretch grow-1`}
            onClick={() => setExpand((exp) => !exp)}
          >
            {expand ? 'Hide' : 'Show'}
          </div>
          <div className={`items-stretch grow-5`}>
            <PrimaryFilter active={chosen < 0 || chosen >= pals.length} />
          </div>
        </div>
      </div>
      <div className={`flex-auto overflow-hidden ${BG_COLLECTION_SECT}`}>
        {content}
      </div>
    </div>
  );
}

export default Collection;
