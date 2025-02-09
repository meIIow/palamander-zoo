import type { MovementFactor } from '../../palamander/movement/movement.ts';
import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import RangeLog from './../common/RangeLog.tsx';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

const generateBehaviorlabel = (low: string, high: string) => {
  return () => (
    <div>
      {low} {'->'} {high}
    </div>
  );
};

type ModifyFactor = (
  factor: MovementFactor,
  interval: number,
) => MovementFactor;

const modifyLinearFactor = (factor: MovementFactor, linear: number) => ({
  ...factor,
  linear,
});

const modifyRotationalFactor = (
  factor: MovementFactor,
  rotational: number,
) => ({
  ...factor,
  rotational,
});

const modifyintervalFactor = (factor: MovementFactor, interval: number) => ({
  ...factor,
  interval,
});

function ModifierBehavior({ mod, customize }: ModifierProps) {
  const generateCustomizeFactor = (modifyFactor: ModifyFactor) => {
    return (value: number) =>
      customize({
        ...mod,
        factor: modifyFactor(mod.factor, value),
      });
  };
  return (
    <div>
      <div>
        <RangeLog
          label={generateBehaviorlabel('lazy', 'zippey')}
          base={2}
          value={mod.factor.linear}
          update={generateCustomizeFactor(modifyLinearFactor)}
        />
        <RangeLog
          label={generateBehaviorlabel('mellow', 'squirrely')}
          base={2}
          value={mod.factor.rotational}
          update={generateCustomizeFactor(modifyRotationalFactor)}
        />
        <RangeLog
          label={generateBehaviorlabel('focused', 'hyper')}
          base={2}
          value={mod.factor.interval}
          update={generateCustomizeFactor(modifyintervalFactor)}
        />
      </div>
    </div>
  );
}

export default ModifierBehavior;
