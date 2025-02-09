import type { RangeConfig } from './Range.tsx';

import Range from './Range.tsx';

type RangeLogProps = {
  label: () => JSX.Element;
  range?: RangeConfig;
  base: number;
  value: number;
  update: (value: number) => void;
};

const defaultRange = {
  scale: 100,
  min: -100,
  max: 100,
  step: 20,
};

function toLog(value: number, base: number): number {
  return Math.log(value) / Math.log(base);
}

function fromLog(log: number, base: number): number {
  return Math.pow(base, log);
}

function RangeLog({ label, range, value, base, update }: RangeLogProps) {
  range = range ?? defaultRange;
  const onChange = (input: number) => {
    update(fromLog(input, base));
  };
  return (
    <Range
      label={label}
      range={range}
      value={toLog(value, base)}
      update={onChange}
    />
  );
}

export default RangeLog;
