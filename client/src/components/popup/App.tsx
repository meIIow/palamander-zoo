import { useState, useEffect, useReducer } from 'react';

import Tab from './Tab.tsx';
import Collection from '../collection/Collection.tsx';
import Exhibit from '../exhibit/Exhibit.tsx';
import { FilterContext, PalFiltersContext } from '../filter/filter-context.ts';
import { PalContext, FilteredPalContext } from '../common/pal-context.ts';

import type { FilterColor, PalamanderFilters } from '../filter/color-filter.ts';
import type { Palamander } from '../../palamander/palamander.ts';

import { Section } from './Tab.tsx';
import {
  initColorFilter,
  filterPals,
  pullPalamanderFilters,
  syncPalamanderFilters,
} from '../filter/color-filter.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';
import { reduceColorFilter } from '../filter/filter-context.ts';

function renderSection(section: Section) {
  switch (section) {
    case Section.Collection:
      return <Collection />;
    case Section.Exhibit:
      return <Exhibit />;
    default:
      return null;
  }
}

function App() {
  const [pals, setPals] = useState<Array<Palamander>>([]);
  const [section, setSection] = useState<Section>(Section.Collection);
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
  const set = async (type: string, color: FilterColor) => {
    setFilters((filters) => {
      const filtersCopy = { ...filters }; // shallow, but we won't modify
      const typeFilter = { ...(filters[type] ?? initColorFilter()) };
      typeFilter[color] = !typeFilter[color];
      filtersCopy[type] = typeFilter;
      syncPalamanderFilters(filtersCopy); // a bit sketchy not to await
      return filtersCopy;
    });
  };

  // const styler: TabStyler = styleTab(showCollection);
  return (
    <div
      className={`max-w-[360px] h-svh overflow-hidden flex flex-col bg-gradient-to-bl from-cyan-500 to-teal-500`}
    >
      <div className={`basis-6 grow-0 shrink-0 items-stretch`}>
        {<Tab section={section} set={setSection} />}
      </div>
      <div className={`flex-auto overflow-hidden items-stretch p-4`}>
        <PalContext.Provider value={pals}>
          <FilteredPalContext.Provider value={filtered}>
            <FilterContext.Provider value={{ filter, dispatch }}>
              <PalFiltersContext.Provider value={{ filters, set }}>
                {renderSection(section)}
              </PalFiltersContext.Provider>
            </FilterContext.Provider>
          </FilteredPalContext.Provider>
        </PalContext.Provider>
      </div>
    </div>
  );
}

export default App;
