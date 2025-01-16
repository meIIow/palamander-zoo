import './Card.css'
import { useEffect, useState } from 'react';
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type CardProps = {
  pal: Palamander,
}

const setStaticPal = (pal: Palamander): Palamander => {
  return { ...pal, override: { freeze: true, move: { speed: 0, angle: 225 } } }
};

function Card({ pal } : CardProps) {
  const [palamander, setPalamander] = useState(setStaticPal(pal));
  const [hovered, setHovered] = useState(false);

  const registerHover = (hover: boolean) => {
    setPalamander(pal => ({ ...pal, override: { ...pal.override, freeze: !hover } }));
    setHovered(hover);
  };

  useEffect(()=> {
    setPalamander(pal => ({ ...setStaticPal(pal), override: { ...pal.override, freeze: !hovered } }));
  }, [pal]);

  return (
    <div>
      <div
        className=" border hover:size-28 size-[104px] rounded-md border-black"
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
      >
        <div className='card'>
          <PalamanderView pal={palamander} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
        </div>
      </div>
    </div>
  )
}

export default Card
