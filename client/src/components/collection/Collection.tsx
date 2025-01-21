import { useState, useContext } from 'react';
import CardMatrix from '../common/CardMatrix.tsx';
import Details from './Details.tsx';
import Filters from '../common/Filters.tsx';
import { FilteredPalContext } from '../common/context.tsx';

function Collection() {
  const [ chosen, setChosen ] = useState(-1); // chosen index
  const pals = useContext(FilteredPalContext);

  const choose = (type: string): void => {
    setChosen(pals.findIndex(pal => pal.type == type));
  }

  const release = (): void => setChosen(-1);
  const shift = (index: number): void => setChosen(index);

  const content = (chosen >= 0 && chosen < pals.length) ?
    (<Details pal={pals[chosen]} index={chosen} count={pals.length} release={release} shift={shift}/>) :
    (<CardMatrix choose={choose}/>);

  return (
    <div>
      <Filters display={chosen >= 0 && chosen < pals.length}/>
      {content}
    </div>
  )
}

export default Collection