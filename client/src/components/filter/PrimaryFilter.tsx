import { useContext } from 'react';

import type { FilterColor } from './color-filter.ts';

import Filter from './Filter.tsx';
import { FilterContext } from './filter-context.ts';

function PrimaryFilter({ active }: { active: boolean }) {
  const { filter, dispatch } = useContext(FilterContext);
  const toggle: (color: FilterColor) => void =
    active ?
      (color: FilterColor) => dispatch({ type: 'TOGGLE', color })
    : (_: FilterColor) => {};
  const extras: { [text: string]: () => void } =
    active ?
      { clear: () => dispatch({ type: 'CLEAR' }) }
    : { locked: () => {} };
  return (
    <div className="size-full">
      <Filter filter={filter} toggle={toggle} extras={extras} />
    </div>
  );
}

export default PrimaryFilter;
