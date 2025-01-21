import { useContext } from 'react';
import Filter from './Filter.tsx';
import { FilterContext } from './context.tsx';

function PrimaryFilter({ active }: { active: boolean }) {
  const { filter, dispatch } = useContext(FilterContext);
  const toggle: (color: string) => void = active
    ? (color: string) => dispatch({ type: 'TOGGLE', color })
    : (_: string) => {}
  const extras: { [text: string]: () => void } = active
    ? { 'clear': () => dispatch({ type: 'CLEAR' }) }
    : { 'locked': () => {} }
  return (
    <div>
      <Filter filter={filter} toggle={toggle} extras={extras}/>
    </div>
  )
}

export default PrimaryFilter