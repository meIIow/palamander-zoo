import { PalSettings } from '../../palamander/palamander.ts';
import { ChangeEvent } from 'react';

function Settings({ settings, customize } : { settings: PalSettings, customize: (settings: PalSettings) => void }) {
  const customizeColor = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...settings, color: event.target.value });
  };
  const customizeMagnification = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...settings, magnification: 10 * Math.pow(5, (parseInt(event.target.value) / 100)) });
  };
  const customizeInterval = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...settings, updateInterval: parseInt(event.target.value) });
  };
  const magExponent = Math.log(settings.magnification / 10) / Math.log(5);
  return (
    <div>
      <div>
        Settings
        <div>
          Color
          <input type="color" value={settings.color} onChange={customizeColor}/>
        </div>
        <div>
          <input type="range" min="-100" value={magExponent*100} max="100" step="20" onChange={customizeMagnification}/>
          {`Magnification: ${Math.round(settings.magnification * 100) / 1000}x`}
        </div>
        <div>
          <input type="range" min="30" value={settings.updateInterval} max="250" step="20" onChange={customizeInterval}/>
          {`Interval: ${settings.updateInterval}`}
        </div>
      </div>
    </div>
  )
}

export default Settings
