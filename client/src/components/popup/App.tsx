import { useState, useEffect, useReducer } from 'react';
import Collection from '../collection/Collection.tsx';
import Exhibit from '../exhibit/Exhibit.tsx';
import { initColorFilter, reduceColorFilter } from '../common/color-filter.ts';
import { Palamander } from '../../palamander/palamander.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';
import { FilterContext, PalContext, FilteredPalContext } from '../common/context.tsx';

function App() {
  const [ pals, setPals ] = useState<Array<Palamander>>([]);
  const [ showCollection, setShowCollection ] = useState(true);
  const [ filter, dispatch ] = useReducer(reduceColorFilter, initColorFilter());

  useEffect(()=> {
    const getPals = async () => {
      const palMap = await readDefaultPalMap();
      setPals(Object.values(palMap));
    };
    getPals();
  }, []);

  return (
    <div className={'max-w-80'}>
      <button className="rounded-full" onClick={() => setShowCollection((_) => true)}>Collection</button>
      <button className="rounded-full" onClick={() => setShowCollection((_) => false)}>Exhibit</button>
      <PalContext.Provider value={pals}><FilteredPalContext.Provider value={pals}>
        <FilterContext.Provider value={{ filter, dispatch }}>
          {showCollection ? <Collection/> : <Exhibit/>}
        </FilterContext.Provider>
      </FilteredPalContext.Provider></PalContext.Provider>
    </div>
  )
}

export default App