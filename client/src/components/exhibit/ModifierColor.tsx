import { ChangeEvent } from 'react';

import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import Range from './../common/Range.tsx';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

function ModifierColor({ mod, customize }: ModifierProps) {
  const customizeColor = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...mod, color: event.target.value });
  };
  const customizeOpacity = (opacity: number) => {
    customize({
      ...mod,
      opacity,
    });
  };
  return (
    <div>
      <div>
        Color
        <input type="color" value={mod.color} onChange={customizeColor} />
        <div>
          <Range
            label={() => <div>Opacity</div>}
            range={{ min: 10, max: 100, step: 5, scale: 100 }}
            value={mod.opacity}
            update={customizeOpacity}
          />
        </div>
      </div>
    </div>
  );
}

export default ModifierColor;
