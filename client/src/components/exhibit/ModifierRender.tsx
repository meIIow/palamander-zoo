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

const generateLogLabel = (label: string, percent: number) => {
  return () => (
    <div>
      {label}: x{roundedFactorFromPercent(percent)}
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
      magnification,
    });
  };
  const customizeInterval = (updateInterval: number) => {
    customize({
      ...mod,
      updateInterval,
    });
  };
  return (
    <div>
      <div>
        <RangeLog
          label={generateLogLabel('magnification', mod.magnification)}
          base={5}
          percent={mod.magnification}
          update={customizeMagnification}
        />
      </div>
      <div>
        <RangeLog
          label={generateLogLabel('motion', 100)}
          base={5}
          percent={100}
          update={(_: number) => {}}
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
