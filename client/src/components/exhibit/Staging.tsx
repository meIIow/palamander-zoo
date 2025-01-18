import './../collection/Card.css'
import { useEffect, useState } from 'react';
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type CardProps = {
  pal: Palamander | null,
  active: boolean,
  select: () => void,
}

const setStaticPal = (pal: Palamander): Palamander => {
  return { ...pal, override: { freeze: false, move: { speed: 0, angle: 225 } } }
};

const StopSpinningPal = (pal: Palamander): Palamander => {
  return { ...pal, override: { freeze: false, move: { speed: 0, turn: 0 } } }
};

const setSpinningPal = (pal: Palamander): Palamander => {
  return { ...pal, override: { freeze: false, move: { speed: 0, turn: 25 } } }
};

const setNullablePal = (hovered: boolean, set: (value: React.SetStateAction<Palamander | null>) => void): void => {
  return set((pal) => {
    if (pal == null) return pal;
    return hovered ? setSpinningPal(pal) : StopSpinningPal(pal);
  });
}

function Staging({ pal, active, select } : CardProps) {
  const [palamander, setPalamander] = useState<Palamander | null>(() => pal == null ? null : setStaticPal(pal));
  const [hovered, setHovered] = useState(false);

  const registerHover = (hover: boolean) => {
    setHovered(hover);
    if (palamander == null) return;
    setNullablePal(hover, setPalamander);
  };

  useEffect(()=> {
    // console.log(pal)
    if (pal == null) return setPalamander(null);
    setPalamander(hovered ? setSpinningPal(pal) : StopSpinningPal(pal));
  }, [pal]);

  // console.log(palamander);

  const content = (palamander == null) ?
    null :
    (<div className='card'>
      <PalamanderView pal={palamander} key={palamander.type} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
    </div>)

  return (
    <div>
      <div
        className={`${active ? 'border-4' : 'border'} hover:size-28 size-[104px] rounded-md border-black`}
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
        onClick={() => select()}
      >
        {content}
      </div>
    </div>
  )
}

export default Staging
