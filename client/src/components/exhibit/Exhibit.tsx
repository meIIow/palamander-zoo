import { useState, useEffect, useContext } from 'react';

import Modifier from './Modifier.tsx';
import Staging from './Staging.tsx';
import Tank from './Tank.tsx';
import CardMatrix from '../common/CardMatrix.tsx';
import PrimaryFilter from './../common/PrimaryFilter.tsx';

import type { Palamander } from '../../palamander/palamander.ts';
import type { PalModifier } from '../../palamander/palamander-modifier.ts';
import type { Exhibited } from './../../extension/storage.ts';

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

type Staged = { pal?: Palamander; mod: PalModifier }[];
type StagingState = {
  staged: Staged;
  active: number;
  selected: number;
};

const createDefaultStagingState = () => ({
  staged: [1, 2, 3].map(() => ({ mod: createDefaultMod() })),
  active: -1,
  selected: -1,
});

const cloneStagingState = (staging: StagingState) => ({
  ...staging,
  staged: cloneStaged(staging.staged),
});

const cloneStaged = (staged: Staged) => {
  return staged.map(({ pal, mod }) => ({ pal, mod: { ...mod } }));
};

const createDefaultMod = () => ({
  override: createNoopOverride(),
  factor: createNoopMovementFactor(),
  updateInterval: 50,
  magnification: 100,
  color: '#000000', // black
});

function stagedFromExhibited(
  pals: Palamander[],
  staged: Staged,
  exhibited: Exhibited,
): Staged {
  return exhibited.map(({ type, mod }, i) => {
    const palIndex = pals.findIndex((pal) => pal.type == type);
    if (palIndex == -1) return staged[i];
    return { ...pals[palIndex], mod };
  });
}

function exhibitedFromStaged(staged: Staged): Exhibited {
  return staged.map(({ pal, mod }) => ({
    type: pal?.type ?? '',
    mod,
  }));
}

function Exhibit() {
  const [staging, setStaging] = useState<StagingState>(
    createDefaultStagingState(),
  );
  const [show, setShow] = useState(false);
  const pals = useContext(PalContext);

  useEffect(() => {
    (async () => {
      // Sync staging with persistant data
      const exhibited = await getExhibit();
      setStaging((staging) => ({
        ...staging,
        staged: stagedFromExhibited(pals, staging.staged, exhibited),
      }));
      // Sync visibility with persistant data
      const isVisible = await visible();
      setShow(isVisible);
    })();
  }, []);

  const toggleShow = async (show: boolean) => {
    await showPal(!show);
    await exhibit(exhibitedFromStaged(staging.staged));
    setShow(!show);
  };

  const syncShow = async () => {
    await exhibit(exhibitedFromStaged(staging.staged));
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
      const staged = cloneStaged(staging.staged);
      const selectedType = staging.staged[staging.selected].pal?.type;
      if (type != selectedType)
        staged[staging.selected] = {
          pal: { ...pals[palIndex] },
          mod: createDefaultMod(),
        };
      return {
        staged,
        selected: -1,
        active: staging.active,
      };
    });

  const generateCustomize = (index: number): ((mod: PalModifier) => void) => {
    return (mod: PalModifier) =>
      setStaging((staging) => {
        const staged = cloneStaged(staging.staged);
        staged[index] = { pal: staged[index].pal, mod: { ...mod } };
        return {
          ...staging,
          staged,
        };
      });
  };

  const isSelected = !(staging.selected < 0 || staging.selected > 2);
  const isActive = !(staging.active < 0 || staging.active > 2);
  const staged = staging.staged.map(({ pal, mod }) => {
    return pal ? { ...pal, mod } : null;
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
        mod={staging.staged[staging.active].mod}
        customize={generateCustomize(staging.active)}
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
        {staging.staged.map(({ pal }, i) => {
          return (
            <Staging
              pal={pal ?? null}
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
