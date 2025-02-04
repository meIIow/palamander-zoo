import { useState, useEffect, useContext } from 'react';

import Modifier from './Modifier.tsx';
import Staging from './Staging.tsx';
import Tank from './Tank.tsx';
import CardMatrix from '../common/CardMatrix.tsx';
import PrimaryFilter from './../common/PrimaryFilter.tsx';

import type { Palamander } from '../../palamander/palamander.ts';
import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import { PalContext } from '../common/pal-context.ts';
import {
  createNoopMovementFactor,
  createNoopOverride,
} from '../../palamander/palamander-modifier.ts';
import {
  show as showPal,
  visible,
  exhibit,
  getExhibit,
} from './../../extension/storage.ts';

type StagedPals = (Palamander | null)[];

type StagingState = {
  staged: StagedPals;
  active: number;
  selected: number;
};
const cloneStagingState = (stagingState: StagingState) => {
  return {
    ...stagingState,
    staged: [...stagingState.staged],
  };
};

type StagedMods = { [type: string]: PalModifier }[];
const cloneStagedMods = (mods: StagedMods): StagedMods => {
  return mods.map((mod) => {
    return Object.fromEntries(
      Object.entries(mod).map(([key, mod]) => [key, { ...mod }]),
    );
  });
};
const getStagedMods = (mods: StagedMods, index: number, key: string) => {
  return mods[index]?.[key] ?? defaultStagedMods;
};
const defaultStagedMods: PalModifier = {
  override: createNoopOverride(),
  factor: createNoopMovementFactor(),
  updateInterval: 50,
  magnification: 100,
  color: '#000000', // black
};

function Exhibit() {
  const [staging, setStaging] = useState<StagingState>({
    staged: [null, null, null],
    active: -1,
    selected: -1,
  });
  const [mods, setMods] = useState<StagedMods>([{}, {}, {}]);
  const [show, setShow] = useState(false);
  const pals = useContext(PalContext);

  useEffect(() => {
    (async () => {
      // Sync staging with persistant data
      const exhibited = await getExhibit();
      setStaging((staging) => {
        const staged = staging.staged.map((staged, i) => {
          const palIndex = pals.findIndex((pal) => pal.type == exhibited[i]);
          if (palIndex == -1) return staged;
          return { ...pals[palIndex] };
        });
        return {
          ...staging,
          staged,
        };
      });
      // Sync visibility with persistant data
      const isVisible = await visible();
      setShow(isVisible);
    })();
  }, []);

  const toggleShow = async (show: boolean) => {
    await showPal(!show);
    await exhibit(staging.staged.map((pal) => pal?.type ?? ''));
    setShow(!show);
  };

  const syncShow = async () => {
    console.log(staging.staged.map((pal) => pal?.type ?? ''));
    await exhibit(staging.staged.map((pal) => pal?.type ?? ''));
  };

  // Switch to a chosen index, then toggle on/off.
  const select = (index: number): void =>
    setStaging((staging) => {
      const selected = staging.selected == index ? -1 : index;
      return {
        ...cloneStagingState(staging),
        selected,
        active: selected,
      };
    });

  const activate = (index: number): void =>
    setStaging((staging) => {
      if (staging.selected > -1) return cloneStagingState(staging);
      return {
        ...cloneStagingState(staging),
        active: index,
      };
    });

  const set = (type: string): void =>
    setStaging((staging) => {
      const palIndex = pals.findIndex((pal) => pal.type == type);
      if (palIndex == -1) return cloneStagingState(staging);
      const staged = [...staging.staged];
      staged[staging.selected] = { ...pals[palIndex] };
      return {
        staged,
        selected: -1,
        active: staging.active,
      };
    });

  const generateCustomize = (
    index: number,
    key: string,
  ): ((mods: PalModifier) => void) => {
    return (mods: PalModifier) =>
      setMods((state) => {
        const clone = cloneStagedMods(state);
        clone[index][key] = { ...mods };
        return clone;
      });
  };

  const isSelected = !(staging.selected < 0 || staging.selected > 2);
  const isActive = !(staging.active < 0 || staging.active > 2);
  const activeType = staging.staged[staging.active]?.type ?? '';
  const staged = staging.staged.map((pal, i) => {
    return pal !== null ?
        { ...pal, mod: mods[i]?.[pal.type] ?? defaultStagedMods }
      : null;
  });

  const selection =
    !isSelected ?
      <Tank pals={staged} />
    : <div>
        <PrimaryFilter active={true} />
        <CardMatrix choose={set} />
      </div>;

  const customizer =
    isActive && !isSelected ?
      <Modifier
        mod={getStagedMods(mods, staging.active, activeType)}
        customize={generateCustomize(staging.active, activeType)}
      />
    : null;

  return (
    <div>
      <button className="rounded-full" onClick={() => toggleShow(show)}>
        {show ? 'hide' : 'show'}
      </button>
      ;
      <button className="rounded-full" onClick={() => syncShow()}>
        sync
      </button>
      ;
      <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
        {staging.staged.map((pal, i) => {
          return (
            <Staging
              pal={pal}
              active={staging.active == i}
              selected={staging.selected == i}
              key={`${i}-${pal == null ? '' : pal.type}`}
              select={() => select(i)}
              hover={() => activate(i)}
            />
          );
        })}
      </div>
      {selection}
      {customizer}
    </div>
  );
}

export default Exhibit;
