import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import Range from './../common/Range.tsx';
import RangeLog from './../common/RangeLog.tsx';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

function roundedFactorFromPercent(percent: number): number {
  // Round to two decimal places.
  return Math.round(percent) / 100;
}

const generateFactorLabel = (
  label: string,
  value: number,
  percent: boolean,
) => {
  if (!percent) value *= 100;
  return () => (
    <div>
      {label}: x{roundedFactorFromPercent(value)}
    </div>
  );
};

const generateUnitLabel = (label: string, units: string, value: number) => {
  return () => (
    <div>
      {label} ({units}): {value}
    </div>
  );
};

function ModifierRender({ mod, customize }: ModifierProps) {
  const customizeMagnification = (magnification: number) => {
    customize({
      ...mod,
      magnification: magnification * 100,
    });
  };
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
    <div>
      <div>
        <RangeLog
          label={generateFactorLabel('magnification', mod.magnification, true)}
          base={5}
          value={mod.magnification / 100}
          update={customizeMagnification}
        />
      </div>
      <div>
        <RangeLog
          label={generateFactorLabel('motion', mod.motion, false)}
          base={5}
          value={mod.motion}
          update={customizeMotion}
        />
      </div>
      <div>
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
