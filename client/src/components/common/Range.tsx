import { ChangeEvent } from 'react';

type RangeConfig = {
  min: number;
  max: number;
  step: number;
  scale: number;
};

type RangeProps = {
  label: () => JSX.Element;
  range: RangeConfig;
  value: number;
  update: (value: number) => void;
};

function Range({ label, range, value, update }: RangeProps) {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    update(parseInt(event.target.value) / range.scale);
  };
  return (
    <div className="flex flex-col stretch">
      <div>{label()}</div>
      <div>
        <input
          type="range"
          className="w-full"
          min={range.min}
          value={value * range.scale}
          max={range.max}
          step={range.step}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export type { RangeConfig };
export default Range;
