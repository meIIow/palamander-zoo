import { useState, useEffect } from 'react';
import Staging from './Staging.tsx';
import CardMatrix from './../collection/CardMatrix.tsx';
import Tank from './Tank.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';

type StagedPals = (Palamander | null)[]

const createChoose = (
    index: number,
    pals: Palamander[],
    set: (value: React.SetStateAction<StagedPals>) => void,
    choose: (value: React.SetStateAction<number>) => void) => {
  return (type: string) => {
    const palIndex = pals.findIndex(pal => pal.type == type);
    console.log(palIndex, pals, index);
    if (palIndex == -1) return;
    set((staged) => {
      const newStaged = [ ...staged ];
      newStaged[index] = pals[palIndex]
      return newStaged
    });
    choose(-1);
  }
}

function Exhibit() {
  const [ pals, setPals ] = useState<Array<Palamander>>([]);
  const [ chosen, setChosen ] = useState(-1); // chosen index
  const [ staged, setStaged ] = useState<StagedPals>([null, null, null]);

  useEffect(()=> {
    const getPals = async () => {
      const palMap = await readDefaultPalMap();
      setPals(Object.values(palMap));
    };
    getPals();
  }, []);

  const choose = (index: number): void => setChosen(index);

  // console.log(staged);

  const selection = (chosen < 0 || chosen > 2) ?
    (<Tank palamanders={staged.filter((pal) => pal != null)}/>) :
    (<CardMatrix pals={pals} choose={createChoose(chosen, pals, setStaged, setChosen)}/>);

  return (
    <div className={'max-w-80'}>
      {<div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
        {staged.map((pal, i) => <Staging pal={pal} active={i==chosen} key={`${i}-${(pal == null) ? '' : pal.type}`} select={() => choose(i)}/>)}
      </div>}
      {selection}
    </div>
  )
}

export default Exhibit