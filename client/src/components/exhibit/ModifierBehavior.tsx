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

function ModifierBehavior({}: ModifierProps) {
  return (
    <div>
      <div>
        <RangeLog
          label={generateBehaviorlabel('lazy', 'zippey')}
          base={2}
          percent={100}
          update={(_: number) => {}}
        />
        <RangeLog
          label={generateBehaviorlabel('mellow', 'squirrely')}
          base={2}
          percent={100}
          update={(_: number) => {}}
        />
        <RangeLog
          label={generateBehaviorlabel('focused', 'hyper')}
          base={2}
          percent={100}
          update={(_: number) => {}}
        />
      </div>
    </div>
  );
}

export default ModifierBehavior;
