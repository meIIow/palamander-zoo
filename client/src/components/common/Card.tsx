import { useEffect, useState } from 'react';
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type CardProps = {
  pal: Palamander,
  choose: (type: string) => void,
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

function Card({ pal, choose } : CardProps) {
  const [palamander, setPalamander] = useState(setStaticPal(pal));
  const [hovered, setHovered] = useState(false);

  const registerHover = (hover: boolean) => {
    setPalamander(pal => hover ? setSpinningPal(pal) : StopSpinningPal(pal));
    setHovered(hover);
  };

  useEffect(()=> {
    setPalamander(pal => hovered ? setSpinningPal(pal) : setStaticPal(pal));
  }, [pal]);

  return (
    <div>
      <div
        className="border hover:size-28 size-[104px] rounded-md border-black"
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
        onClick={() => choose(palamander.type)}
      >
        <div className='pal-boundry'>
          <PalamanderView pal={palamander} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
        </div>
      </div>
    </div>
  )
}

export default Card
