import { useState, useEffect } from 'react';
import CardMatrix from './CardMatrix.tsx';
import { PalamanderSpec, readDefaultPalSpecs } from '../../palamander/create-palamander.ts';

function Collection() {
  const [pals, setPals] = useState<Array<PalamanderSpec>>(() => []);

  useEffect(()=> {
    const getPals = async () => {
      const pals = await readDefaultPalSpecs();
      setPals(pals);
    };
    getPals();
  }, []);

  return (
    <div className={'max-w-80'}>
      <div>
        <CardMatrix pals={pals}/>
      </div>
    </div>
  )
}

export default Collection