import { useState } from 'react';

import Nook from './Nook.tsx';
import PalamanderFilter from './PalamanderFilter.tsx';
import PalamanderView from '../palamander/PalamanderView.tsx';

import type { Palamander } from '../../palamander/palamander.ts';

import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';
import {
  createPointedOverride,
  createStillOverride,
  createSpinOverride,
} from '../../palamander/palamander-modifier.ts';

type CardProps = {
  pal: Palamander;
  choose: (type: string) => void;
  expand: boolean;
};

const setStaticPal = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createPointedOverride(270) },
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

function Card({ pal, choose, expand }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [initial, setInitial] = useState(true);
  const palamander =
    initial ? setStaticPal(pal)
    : hovered ? setSpinningPal(pal)
    : StopSpinningPal(pal);
  const registerExpanded = (expanded: boolean) => setExpanded(expanded);
  const registerHover = (hover: boolean) => {
    setHovered((_) => hover);
    setInitial((_) => false);
  };

  return (
    <div
      className="aspect-square flex justify-center items-center bg-slate-500"
      onClick={() => choose(palamander.type)}
    >
      <div
        className="relative hover:size-full size-11/12 rounded-lg overflow-hidden bg-red-500"
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
      >
        <Nook
          content={<div>{pal.type}</div>}
          corner="top-0 left-0"
          expand={expand || expanded}
          set={registerExpanded}
        />
        <div
          className="pal-boundry pointer-events-none 
 rounded-br-3xl z-10 rounded-tl-3xl bg-orange-500"
        >
          <PalamanderView
            pal={palamander}
            display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
          />
        </div>
        <Nook
          content={<PalamanderFilter type={pal.type} />}
          corner="bottom-0 right-0"
          expand={expand || expanded}
          set={registerExpanded}
        />
      </div>
    </div>
  );
}

export default Card;
