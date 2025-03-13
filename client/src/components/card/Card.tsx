import { useContext, useState } from 'react';

import Nook from './Nook.tsx';
import PalamanderView from '../palamander/PalamanderView.tsx';

import type { Palamander } from '../../palamander/palamander.ts';

import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';
import {
  createPointedOverride,
  createStillOverride,
  createSpinOverride,
} from '../../palamander/palamander-modifier.ts';
import { CardColor } from '../common/card-color.ts';
import useVisibility from '../common/useVisibility.tsx';
import { ContainerContext } from '../common/container-context.ts';

type CardProps = {
  pal?: Palamander;
  choose: (type: string) => void;
  upper?: JSX.Element;
  lower?: JSX.Element;
  expand: boolean;
  color: CardColor;
  // cursor: string;
};

const setPalStatic = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createPointedOverride(300) },
  };
};

const stopPalSpinning = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createStillOverride() },
  };
};

const setPalSpinning = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: { ...pal.mod, override: createSpinOverride(25) },
  };
};

const setPalFrozen = (pal: Palamander): Palamander => {
  return {
    ...pal,
    mod: {
      ...pal.mod,
      override: { ...createPointedOverride(300), freeze: true },
    },
  };
};

function Card({ pal, choose, upper, lower, expand, color }: CardProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [initial, setInitial] = useState(true);
  const [elementRef, isVisible] = useVisibility(useContext(ContainerContext));

  const setPalMotion =
    !isVisible ? setPalFrozen
    : initial ? setPalStatic
    : hovered ? setPalSpinning
    : stopPalSpinning;

  const registerExpanded = (expanded: boolean) => setExpanded(expanded);
  const registerHover = (hover: boolean) => {
    setHovered((_) => hover);
    setInitial((_) => false);
  };

  const upperNook =
    !upper ? null : (
      <Nook
        content={upper}
        corner="top-0 left-0"
        expand={expand || expanded}
        set={registerExpanded}
      />
    );

  const lowerNook =
    !lower ? null : (
      <Nook
        content={lower}
        corner="bottom-0 right-0"
        expand={expand || expanded}
        set={registerExpanded}
      />
    );

  const topCornerStyle = !upper ? '' : 'rounded-tl-3xl';
  const lowCornerStyle = !lower ? '' : 'rounded-br-3xl';
  const colorStyle = hovered ? color.active : color.passive;

  return (
    <div
      className="aspect-square flex justify-center items-center cursor-pointer"
      onClick={() => choose(pal?.type ?? '')}
      ref={elementRef}
    >
      <div
        className={`relative hover:size-full size-11/12 rounded-lg overflow-hidden`}
        onMouseEnter={() => registerHover(true)}
        onMouseLeave={() => registerHover(false)}
      >
        {upperNook}
        <div
          className={`pal-boundry pointer-events-none z-10 ${topCornerStyle} ${lowCornerStyle} ${colorStyle}`}
        >
          {pal == undefined ? null : (
            <PalamanderView
              pal={setPalMotion(pal)}
              display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
            />
          )}
        </div>
        {lowerNook}
      </div>
    </div>
  );
}

export default Card;
