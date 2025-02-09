import type { RangeConfig } from './Range.tsx';

import Range from './Range.tsx';

type RangeLogProps = {
  label: () => JSX.Element;
  range?: RangeConfig;
  base: number;
  percent: number;
  update: (value: number) => void;
};

const defaultRange = {
  scale: 100,
  min: -100,
  max: 100,
  step: 20,
};

function logFromPercent(percent: number, base: number): number {
  return Math.log(percent / 100) / Math.log(base);
}

function logToPercent(log: number, base: number): number {
  return 100 * Math.pow(base, log);
}

function RangeLog({ label, range, percent, base, update }: RangeLogProps) {
  range = range ?? defaultRange;
  const onChange = (input: number) => {
    update(logToPercent(input, base));
  };
  return (
    <Range
      label={label}
      range={range}
      value={logFromPercent(percent, base)}
      update={onChange}
    />
  );
}

export default RangeLog;
