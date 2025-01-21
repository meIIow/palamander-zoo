import { useState } from 'react';
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type CardProps = {
  pal: Palamander | null,
  active: boolean,
  selected: boolean,
  select: () => void,
  hover?: () => void,
}

const setStaticPal = (pal: Palamander): Palamander => {
  return { ...pal, override: { freeze: false, move: { speed: 0, angle: 270 } } }
};

function Staging({ pal, active, selected, select, hover } : CardProps) {
  const [hovered, setHovered] = useState(false);
  const palamander =  pal == null ? null : setStaticPal(pal)

  const registerHover = (hovered: boolean) => {
    if (hovered && !!hover) hover();
    setHovered(hovered);
  };

  const content = (palamander == null) ?
    null :
    (<div className='pal-boundry'>
      <PalamanderView pal={palamander} key={palamander.type} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
    </div>)

  const border = selected ? 'border-4' : 'border';
  const size = (active || hovered) ? 'size-28' : 'size-[104px]';
  return (
    <div>
      <div
        className={`${border} ${size} rounded-md border-black`}
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
