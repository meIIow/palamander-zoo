import { useContext } from 'react';
import Filter from './Filter.tsx';
import { FilterContext } from './context.tsx';

function Filters({ display }: { display: boolean}) {
  const { filter, dispatch } = useContext(FilterContext);
  const toggle = (display) ? (_: string) => {} : (color: string) => dispatch({ type: 'TOGGLE', color });
  const reset = (display) ? () => {} : () => dispatch({ type: 'CLEAR' });
  return (
    <div>
      {Object.entries(filter).map(([ color, active ]) => {
        return (<Filter color={color} active={active} key={color} toggle={toggle}/>)
      })}
      <button className="rounded-full" onClick={reset}>reset</button>
    </div>
  )
}

export default Filters