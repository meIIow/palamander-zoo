import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import Range from './../common/Range.tsx';
import RangeLog from './../common/RangeLog.tsx';

import { generateFactorLabel } from './modifier-label.tsx';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

const generateUnitLabel = (label: string, units: string, value: number) => {
  return () => (
    <div className="text-base">
      {label} ({units}): {value}
    </div>
  );
};

function ModifierRender({ mod, customize }: ModifierProps) {
  const customizeInterval = (updateInterval: number) => {
    customize({
      ...mod,
      updateInterval,
    });
  };
  const customizeMotion = (motion: number) => {
    customize({
      ...mod,
      motion,
    });
  };
  return (
    <div className="flex flex-wrap justify-evenly">
      <div className="w-5/12">
        <RangeLog
          label={generateFactorLabel('motion', mod.motion, false, false)}
          base={5}
          value={mod.motion}
          update={customizeMotion}
        />
      </div>
      <div className="w-5/12">
        <Range
          label={generateUnitLabel('interval', 'ms', mod.updateInterval)}
          range={{ min: 30, max: 250, step: 20, scale: 1 }}
          value={mod.updateInterval}
          update={customizeInterval}
        />
      </div>
    </div>
  );
}

export default ModifierRender;
