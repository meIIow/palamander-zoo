import { useState, useContext } from 'react';
import Staging from './Staging.tsx';
import CardMatrix from '../common/CardMatrix.tsx';
import Tank from './Tank.tsx';
import PrimaryFilter from './../common/PrimaryFilter.tsx'
import { Palamander, PalSettings } from '../../palamander/palamander.ts';
import { PalContext } from '../common/pal-context.ts';
import Settings from './Settings.tsx'

type StagedPals = (Palamander | null)[];

type StagingState = {
  staged: StagedPals,
  active: number,
  selected: number,
}
const cloneStagingState = (stagingState: StagingState) => {
  return {
    ...stagingState,
    staged: [ ...stagingState.staged ]
  }
}

type StagedSettings = { [type: string]: PalSettings }[]
const cloneStagedSettings = (stagedSettings: StagedSettings): StagedSettings => {
  return stagedSettings.map((settings) => {
    return Object.fromEntries(Object.entries(settings).map(([ key, s ]) => [ key, { ...s } ]));
  });
}
const getStagedSettings = (stagedSettings: StagedSettings, index: number, key: string) => {
  return stagedSettings[index]?.[key] ?? defaultStagedSettings;
}
const defaultStagedSettings: PalSettings = {
  updateInterval: 50,
  magnification: 10,
  color: '#000000',
}

function Exhibit() {
  const [ staging, setStaging ] = useState<StagingState>({
    staged: [ null, null, null ],
    active: -1,
    selected: -1 });
  const [ settings, setSettings ] = useState<StagedSettings>([{}, {}, {}]);
  const pals = useContext(PalContext);

  // Switch to a chosen index, then toggle on/off.
  const select = (index: number): void => setStaging((staging) => {
    const selected = (staging.selected == index) ? -1 : index
    return {
      ...cloneStagingState(staging),
      selected,
      active: selected,
    };
  });

  const activate = (index: number): void => setStaging((staging) => {
    if (staging.selected > -1) return cloneStagingState(staging);
    return {
      ...cloneStagingState(staging),
      active: index,
    };
  });

  const set = (type: string): void => setStaging((staging) => {
    const palIndex = pals.findIndex(pal => pal.type == type);
    if (palIndex == -1) return cloneStagingState(staging);
    const staged = [ ...staging.staged ];
    staged[staging.selected] = { ...pals[palIndex] };
    return {
      staged,
      selected: -1,
      active: staging.active,
    };
  });

  const generateCustomize = (index: number, key: string): (settings: PalSettings) => void => {
    return (settings: PalSettings) => setSettings((state) => {
      const clone = cloneStagedSettings(state);
      clone[index][key] = { ...settings };
      return clone;
    });
  };

  const isSelected = !(staging.selected < 0 || staging.selected > 2);
  const isActive = !(staging.active < 0 || staging.active > 2);
  const activeType = staging.staged[staging.active]?.type ?? '';
  const staged = staging.staged.map((pal, i) => {
    return (pal !== null)
      ? { ...pal, settings: settings[i]?.[pal.type] ?? defaultStagedSettings }
      : null
  });

  const selection = !isSelected ?
    (<Tank pals={staged.filter((pal) => pal != null)}/>) :
    (<div><PrimaryFilter active={true}/><CardMatrix choose={set}/></div>);

  const customizer = (isActive && !isSelected) ?
    (<Settings settings={getStagedSettings(settings, staging.active, activeType)} customize={generateCustomize(staging.active, activeType)}/>) :
    null;

  return (
    <div>
      <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
        {staging.staged.map((pal, i) => {
          return <Staging
            pal={pal}
            active={staging.active == i}
            selected={staging.selected == i}
            key={`${i}-${(pal == null) ? '' : pal.type}`}
            select={() => select(i)}
            hover={() => activate(i)}
          />
        })}
      </div>
      {selection}
      {customizer}
    </div>
  )
}

export default Exhibit