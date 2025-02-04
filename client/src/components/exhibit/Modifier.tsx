import { PalModifier } from '../../palamander/palamander-modifier.ts';
import { ChangeEvent } from 'react';

type ModifierProps = {
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

function Modifier({ mod, customize }: ModifierProps) {
  const customizeColor = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...mod, color: event.target.value });
  };
  const customizeMagnification = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({
      ...mod,
      magnification: 100 * Math.pow(5, parseInt(event.target.value) / 100),
    });
  };
  const customizeInterval = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({
      ...mod,
      updateInterval: parseInt(event.target.value),
    });
  };
  const magExponent = Math.log(mod.magnification / 100) / Math.log(5);
  return (
    <div>
      <div>
        Settings
        <div>
          Color
          <input type="color" value={mod.color} onChange={customizeColor} />
        </div>
        <div>
          <input
            type="range"
            min="-100"
            value={magExponent * 100}
            max="100"
            step="20"
            onChange={customizeMagnification}
          />
          {`Magnification: ${Math.round(mod.magnification * 100) / 10000}x`}
        </div>
        <div>
          <input
            type="range"
            min="30"
            value={mod.updateInterval}
            max="250"
            step="20"
            onChange={customizeInterval}
          />
          {`Interval: ${mod.updateInterval}`}
        </div>
      </div>
    </div>
  );
}

export default Modifier;
