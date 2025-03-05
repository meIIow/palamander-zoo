import { ChangeEvent } from 'react';

type ColorSelectorProps = {
  color: string;
  customizeColor: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ColorSelector({ color, customizeColor }: ColorSelectorProps) {
  return (
    <div className="flex flex-col stretch text-base">
      <div className="text-center">color</div>
      <input
        className="w-full h-4"
        type="color"
        value={color}
        onChange={customizeColor}
      />
    </div>
  );
}

export default ColorSelector;
