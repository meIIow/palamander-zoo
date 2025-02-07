import { useState, useEffect, useReducer } from 'react';

import Tab from './Tab.tsx';
import Collection from '../collection/Collection.tsx';
import Exhibit from '../exhibit/Exhibit.tsx';
import { FilterContext, PalFiltersContext } from '../common/filter-context.ts';
import { PalContext, FilteredPalContext } from '../common/pal-context.ts';

import type { TabStyler } from './Tab.tsx';
import type { PalamanderFilters } from '../common/color-filter.ts';
import type { Palamander } from '../../palamander/palamander.ts';

import {
  initColorFilter,
  filterPals,
  pullPalamanderFilters,
  syncPalamanderFilters,
} from '../common/color-filter.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';
import { reduceColorFilter } from '../common/filter-context.ts';

const BG_COLLECTION = 'bg-teal-600';
const BG_EXHIBIT = 'bg-cyan-600';

const styleTab = (showCollection: boolean) => ({
  background: showCollection ? BG_COLLECTION : BG_EXHIBIT,
  sliver: !showCollection ? BG_COLLECTION : BG_EXHIBIT,
  backgroundCol: BG_COLLECTION,
  backgroundExh: BG_EXHIBIT,
  borderCol: showCollection ? 'border-r-2' : 'border-b-2',
  borderExh: !showCollection ? 'border-l-2' : 'border-b-2',
});

function App() {
  const [pals, setPals] = useState<Array<Palamander>>([]);
  const [showCollection, setShowCollection] = useState(true);
  const [filter, dispatch] = useReducer(reduceColorFilter, initColorFilter());
  const [filters, setFilters] = useState<PalamanderFilters>({});

  useEffect(() => {
    (async () => {
      const palMap = await readDefaultPalMap();
      setPals(Object.values(palMap));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const filters = await pullPalamanderFilters();
      setFilters((_) => filters);
    })();
  }, []);

  const filtered = filterPals(pals, filters, filter);
  const set = async (type: string, color: string) => {
    setFilters((filters) => {
      const filtersCopy = { ...filters }; // shallow, but we won't modify
      const typeFilter = { ...(filters[type] ?? initColorFilter()) };
      typeFilter[color as keyof typeof typeFilter] =
        !typeFilter[color as keyof typeof typeFilter];
      filtersCopy[type] = typeFilter;
      syncPalamanderFilters(filtersCopy); // a bit sketchy not to await
      return filtersCopy;
    });
  };

  const styler: TabStyler = styleTab(showCollection);
  return (
    <div className={`max-w-[360px] h-svh flex flex-col ${styler.background}`}>
      <div
        className={`basis-12 grow-0 shrink-0 items-stretch ${styler.sliver}`}
      >
        {<Tab styler={styler} set={setShowCollection} />}
      </div>
      <div className={`grow items-stretch ${styler.background} p-4`}>
        <PalContext.Provider value={pals}>
          <FilteredPalContext.Provider value={filtered}>
            <FilterContext.Provider value={{ filter, dispatch }}>
              <PalFiltersContext.Provider value={{ filters, set }}>
                {showCollection ?
                  <Collection />
                : <Exhibit />}
              </PalFiltersContext.Provider>
            </FilterContext.Provider>
          </FilteredPalContext.Provider>
        </PalContext.Provider>
      </div>
    </div>
  );
}

export default App;
