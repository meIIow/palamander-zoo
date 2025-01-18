import { useState, useEffect } from 'react';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'
import PalamanderView from '../palamander/PalamanderView.tsx';

function Tank({ palamanders } : { palamanders: Palamander[] } ) {
  const [ pals, setPals ] = useState<Array<Palamander>>([]);

  useEffect(()=> {
    setPals(palamanders);
  }, [palamanders]);

  const palContent = (pals.length == 0) ?
    null :
    pals.map((pal) => (<PalamanderView pal={{ ...pal }} key={pal.type} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>));

  return (
    <div className='size-80 border'>
      {<div className='card'>
        {palContent}
      </div>}
    </div>
  )
}

export default Tank