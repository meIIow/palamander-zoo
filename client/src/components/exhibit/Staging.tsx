import { useState } from 'react';
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';

import { type CardColor } from '../common/card-color.ts';

type CardProps = {
  pal: Palamander | null;
  active: boolean;
  selected: boolean;
  color: CardColor;
  select: () => void;
  hover?: () => void;
};

const setStaticPal = (pal: Palamander): Palamander => {
  const moveOverride = { linear: { velocity: 0 }, rotational: {}, angle: 270 };
  const mod = { ...pal.mod, override: { freeze: false, move: moveOverride } };
  return { ...pal, mod };
};

function Staging({ pal, active, selected, color, select, hover }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const palamander = pal == null ? null : setStaticPal(pal);

  const registerHover = (hovered: boolean) => {
    if (hovered && !!hover) hover();
    setHovered(hovered);
  };

  const content =
    palamander == null ? null : (
      <div className="pal-boundry">
        <PalamanderView
          pal={palamander}
          key={palamander.type}
          display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
        />
      </div>
    );

  const border = selected ? 'border-4' : 'border';
  const colorStyle = active ? color.active : color.passive;
  const size = active || hovered ? 'size-full' : 'size-11/12';
  return (
    <div
      className="aspect-square flex justify-center items-center"
      style={{ cursor: 'pointer' }}
    >
      <div
        className={`${border} ${size} relative rounded-lg overflow-hidden ${colorStyle} border-black`}
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
        onClick={() => select()}
      >
        {content}
      </div>
    </div>
  );
}

export default Staging;
