import { useState, useContext } from 'react';
import Staging from './Staging.tsx';
import CardMatrix from '../common/CardMatrix.tsx';
import Tank from './Tank.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { PalContext } from '../common/context.tsx';

type StagedPals = (Palamander | null)[]
type StagingState = {
  staged: StagedPals,
  active: number,
  selected: number,
}

const cloneStagingState = (stagingState: StagingState) => {
  return {
    ...stagingState,
    staged: [ ...stagingState.staged ]
  }
}

function Exhibit() {
  const [ staging, setStaging ] = useState<StagingState>({
    staged: [ null, null, null ],
    active: -1,
    selected: -1 });
  const pals = useContext(PalContext);

  // Switch to a chosen index, then toggle on/off.
  const select = (index: number): void => setStaging((staging) => {
    const selected = (staging.selected == index) ? -1 : index
    return {
      ...cloneStagingState(staging),
      selected,
      active: selected,
    };
  });

  const activate = (index: number): void => setStaging((staging) => {
    if (staging.selected > -1) return cloneStagingState(staging);
    return {
      ...cloneStagingState(staging),
      active: index,
    };
  });

  const set = (type: string): void => setStaging((staging) => {
    const palIndex = pals.findIndex(pal => pal.type == type);
    if (palIndex == -1) return cloneStagingState(staging);
    const staged = [ ...staging.staged ];
    staged[staging.selected] = { ...pals[palIndex] };
    return {
      staged,
      selected: -1,
      active: staging.active,
    };
  });

  const selection = (staging.selected < 0 || staging.selected > 2) ?
    (<Tank pals={staging.staged.filter((pal) => pal != null)}/>) :
    (<CardMatrix choose={set}/>);

  return (
    <div>
      <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
        {staging.staged.map((pal, i) => {
          return <Staging
            pal={pal}
            active={staging.active == i}
            selected={staging.selected == i}
            key={`${i}-${(pal == null) ? '' : pal.type}`}
            select={() => select(i)}
            hover={() => activate(i)}
          />
        })}
      </div>
      {selection}
    </div>
  )
}

export default Exhibit