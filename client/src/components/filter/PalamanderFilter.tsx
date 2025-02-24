import { useContext } from 'react';

import type { FilterColor } from './color-filter.ts';

import Filter from './Filter.tsx';
import { PalFiltersContext } from './filter-context.ts';
import { initColorFilter } from './color-filter.ts';

function PalamanderFilter({ type }: { type: string }) {
  const { filters, set } = useContext(PalFiltersContext);
  const filter = type in filters ? filters[type] : initColorFilter();
  return (
    <div className="size-full">
      <Filter
        filter={filter}
        toggle={(color: FilterColor) => set(type, color)}
        extras={{}}
      />
    </div>
  );
}

export default PalamanderFilter;
