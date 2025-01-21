import { useContext } from 'react';
import Filter from './Filter.tsx';
import { PalFiltersContext } from './context.tsx';
import { initColorFilter } from './color-filter.ts';

function PalamanderFilter({ type }: { type: string }) {
  const { filters, set } = useContext(PalFiltersContext);
  const filter = (type in filters) ? filters[type] : initColorFilter();
  return (
    <div>
      <Filter filter={filter} toggle={(color: string) => set(type, color)} extras={{}}/>
    </div>
  )
}

export default PalamanderFilter