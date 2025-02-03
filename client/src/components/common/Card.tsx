import { useState } from 'react';

import PalamanderView from '../palamander/PalamanderView.tsx';

import type { Palamander } from '../../palamander/palamander.ts';

import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';
import {
  createPointedOverride,
  createStillOverride,
  createSpinOverride,
} from '../../palamander/palamander-modifier.ts';
import PalamanderFilter from './PalamanderFilter.tsx';

type CardProps = {
  pal: Palamander;
  choose: (type: string) => void;
};

const setStaticPal = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createPointedOverride(225) },
  };
};

const StopSpinningPal = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createStillOverride() },
  };
};

const setSpinningPal = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createSpinOverride(25) },
  };
};

function Card({ pal, choose }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [initial, setInitial] = useState(true);
  const palamander =
    initial ? setStaticPal(pal)
    : hovered ? setSpinningPal(pal)
    : StopSpinningPal(pal);
  const registerHover = (hover: boolean) => {
    setHovered((_) => hover);
    setInitial((_) => false);
  };
  return (
    <div>
      <div
        className="border hover:size-28 size-[104px] rounded-md border-black"
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
      >
        <div className="pal-boundry" onClick={() => choose(palamander.type)}>
          <PalamanderView
            pal={palamander}
            display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
          />
        </div>
        <PalamanderFilter type={pal.type} />
      </div>
    </div>
  );
}

export default Card;
