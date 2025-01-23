import { PalSettings } from '../../palamander/palamander.ts';
import { ChangeEvent } from 'react';

function Settings({ settings, customize } : { settings: PalSettings, customize: (settings: PalSettings) => void }) {
  const customizeColor = (event: ChangeEvent<HTMLInputElement>) => {
    return customize({ ...settings, color: event.target.value });
  };
  return (
    <div>
      <div>
        Settings
        <input type="color" value={settings.color} onChange={customizeColor}/>
      </div>
    </div>
  )
}

export default Settings
