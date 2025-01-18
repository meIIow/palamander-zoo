import { useState, useEffect } from 'react';
import CardMatrix from './CardMatrix.tsx';
import Details from './Details.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { readDefaultPalMap } from '../../palamander/create-palamander.ts';

function Collection() {
  // const [ palMap, setPalMap ] = useState<PalamanderMap>({});
  const [ pals, setPals ] = useState<Array<Palamander>>([]);
  const [ chosen, setChosen ] = useState(-1); // chosen index

  useEffect(()=> {
    const getPals = async () => {
      const palMap = await readDefaultPalMap();
      // setPalMap(palMap);
      setPals(Object.values(palMap));
    };
    getPals();
  }, []);

  const choose = (type: string): void => {
    setChosen(pals.findIndex(pal => pal.type == type));
  }

  const release = (): void => setChosen(-1);

  const shift = (index: number): void => setChosen(index);

  const content = (chosen >= 0 && chosen < pals.length) ?
    (<Details pal={pals[chosen]} index={chosen} count={pals.length} release={release} shift={shift}/>) :
    (<CardMatrix pals={pals} choose={choose}/>);

  return (
    <div className={'max-w-80'}>
      {<div>
        {content}
      </div>}
    </div>
  )
}

export default Collection