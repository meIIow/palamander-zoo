import { useState, useEffect, useReducer } from 'react';

import Collection from '../collection/Collection.tsx';
import Exhibit from '../exhibit/Exhibit.tsx';
import { FilterContext, PalFiltersContext } from '../common/filter-context.ts';
import { PalContext, FilteredPalContext } from '../common/pal-context.ts';

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
  return (
    <div className={'max-w-80'}>
      <button
        className="rounded-full"
        onClick={() => setShowCollection((_) => true)}
      >
        Collection
      </button>
      <button
        className="rounded-full"
        onClick={() => setShowCollection((_) => false)}
      >
        Exhibit
      </button>
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
  );
}

export default App;
