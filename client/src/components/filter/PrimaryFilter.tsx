import { useContext } from 'react';

import type { FilterColor } from './color-filter.ts';

import ColorToggles from './ColorToggles.tsx';
import { ColorToggleSpec } from './ColorToggles.tsx';
import { FilterContext } from './filter-context.ts';

function PrimaryFilter({ active }: { active: boolean }) {
  const { filter, dispatch } = useContext(FilterContext);
  const toggle: (color: FilterColor) => void =
    active ?
      (color: FilterColor) => dispatch({ type: 'TOGGLE', color })
    : (_: FilterColor) => {};
  return (
    <div className="size-full">
      <ColorToggles
        filter={filter}
        spec={ColorToggleSpec.Medium}
        toggle={toggle}
      />
    </div>
  );
}

export default PrimaryFilter;
