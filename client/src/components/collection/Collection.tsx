import { useState, useRef, useContext, useEffect } from 'react';

import DeckView from '../common/DeckView.tsx';
import Details from './Details.tsx';
import FilterDash from '../filter/FilterDash.tsx';
import { FilteredPalContext } from '../common/pal-context.ts';
import { ContainerContext } from '../common/container-context.ts';

function Collection() {
  const [chosen, setChosen] = useState(-1); // chosen index
  const [expand, setExpand] = useState(false); // chosen index
  const pals = useContext(FilteredPalContext);
  const [bios, setBios] = useState<Record<string, string>>({});
  const containerRef = useRef(null);

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
    : <ContainerContext.Provider value={containerRef.current}>
        <DeckView choose={choose} expand={expand} />
      </ContainerContext.Provider>;

  return (
    <div className="size-full flex flex-col items-stretch gap-x-4">
      <div className={`w-full flex flex-col grow-0`}>
        <FilterDash
          active={chosen < 0 || chosen >= pals.length}
          expand={expand}
          setExpand={setExpand}
        />
      </div>
      <div className={`flex-auto overflow-hidden`} ref={containerRef}>
        {content}
      </div>
    </div>
  );
}

export default Collection;
