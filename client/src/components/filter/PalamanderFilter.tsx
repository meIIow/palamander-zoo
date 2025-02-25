import { useContext } from 'react';

import type { FilterColor } from './color-filter.ts';

import ColorToggles from './ColorToggles.tsx';
import { ColorToggleSpec } from './ColorToggles.tsx';
import { PalFiltersContext } from './filter-context.ts';
import { initColorFilter } from './color-filter.ts';

function PalamanderFilter({ type }: { type: string }) {
  const { filters, set } = useContext(PalFiltersContext);
  const filter = type in filters ? filters[type] : initColorFilter();
  return (
    <div className="size-full">
      <ColorToggles
        filter={filter}
        spec={ColorToggleSpec.Small}
        toggle={(color: FilterColor) => set(type, color)}
      />
    </div>
  );
}

export default PalamanderFilter;
