import { useState, useEffect, useReducer } from 'react';
import Collection from '../collection/Collection.tsx';
import Exhibit from '../exhibit/Exhibit.tsx';
import { initColorFilter, reduceColorFilter, filterPals, PalColorFilters } from '../common/color-filter.ts';
import { Palamander } from '../../palamander/palamander.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';
import { FilterContext, PalContext, FilteredPalContext, PalFiltersContext } from '../common/context.tsx';

function App() {
  const [ pals, setPals ] = useState<Array<Palamander>>([]);
  const [ showCollection, setShowCollection ] = useState(true);
  const [ filter, dispatch ] = useReducer(reduceColorFilter, initColorFilter());
  const [ filters, setFilters ] = useState<PalColorFilters>({
    'axolotl': { red: true, green: true, blue: true, purple: true },
    'newt': { red: false, green: false, blue: false, purple: false },
    'octopus': { red: true, green: false, blue: true, purple: false },
    'frog': { red: false, green: true, blue: false, purple: true },
    'asdfsdkja': { red: true, green: true, blue: true, purple: true },
  });

  useEffect(()=> {
    const getPals = async () => {
      const palMap = await readDefaultPalMap();
      setPals(Object.values(palMap));
    };
    getPals();
  }, []);

  const filtered = filterPals(pals, filters, filter);
  const set = (type: string, color: string) => setFilters((filters) => {
    const filtersCopy = { ...filters }; // shallow, but w/e
    const typeFilter = { ...(filters[type] ?? initColorFilter()) };
    typeFilter[color as keyof typeof typeFilter] = !(typeFilter[color as keyof typeof typeFilter]);
    filtersCopy[type] = typeFilter;
    return filtersCopy;
  })
  return (
    <div className={'max-w-80'}>
      <button className="rounded-full" onClick={() => setShowCollection((_) => true)}>Collection</button>
      <button className="rounded-full" onClick={() => setShowCollection((_) => false)}>Exhibit</button>
      <PalContext.Provider value={pals}><FilteredPalContext.Provider value={filtered}>
        <FilterContext.Provider value={{ filter, dispatch }}><PalFiltersContext.Provider value={{ filters, set }}>
          {showCollection ? <Collection/> : <Exhibit/>}
        </PalFiltersContext.Provider></FilterContext.Provider>
      </FilteredPalContext.Provider></PalContext.Provider>
    </div>
  )
}

export default App