import { ChangeEvent } from 'react';

import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import ColorSelector from './../common/ColorSelector.tsx';
import Range from './../common/Range.tsx';
import RangeLog from '../common/RangeLog.tsx';

import { generateFactorLabel } from './modifier-label.tsx';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

function ModifierColor({ mod, customize }: ModifierProps) {
  const customizeColor = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...mod, color: event.target.value });
  };
  const customizeMagnification = (magnification: number) => {
    customize({
      ...mod,
      magnification: magnification * 100,
    });
  };
  const customizeOpacity = (opacity: number) => {
    customize({
      ...mod,
      opacity,
    });
  };
  return (
    <div className="flex flex-wrap justify-evenly">
      <div className="w-5/12">
        <RangeLog
          label={generateFactorLabel('magnification', mod.magnification, true)}
          base={5}
          value={mod.magnification / 100}
          update={customizeMagnification}
        />
      </div>
      <div className="w-5/12">
        <Range
          label={() => <div className="text-center text-base">opacity</div>}
          range={{ min: 10, max: 100, step: 5, scale: 100 }}
          value={mod.opacity}
          update={customizeOpacity}
        />
      </div>
      <div className="w-5/12">
        <ColorSelector color={mod.color} customizeColor={customizeColor} />
      </div>
    </div>
  );
}

export default ModifierColor;
