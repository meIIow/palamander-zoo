import { BsBan } from 'react-icons/bs';
import { useContext } from 'react';

import { FilterContext } from './filter-context.ts';

function FilterClear() {
  const { dispatch } = useContext(FilterContext);
  return (
    <button onClick={() => dispatch({ type: 'CLEAR' })}>
      <BsBan />
    </button>
  );
}

export default FilterClear;
