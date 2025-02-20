import type { Palamander } from '../../palamander/palamander.ts';
import type { PalModifier } from '../../palamander/palamander-modifier.ts';
import type { Exhibited } from './../../extension/storage.ts';

import {
  createNoopMovementFactor,
  createNoopOverride,
} from '../../palamander/palamander-modifier.ts';

type Staged = { pal?: Palamander; mod: PalModifier }[];
type StagingState = {
  staged: Staged;
  active: number;
  selected: number;
};

/* -----------------------------
 * Creation and cloning logic
 * ----------------------------- */

const initStagingState = () => ({
  staged: [1, 2, 3].map(() => ({ mod: initMod() })),
  active: -1,
  selected: -1,
});

const initMod = (mod?: PalModifier) => ({
  override: createNoopOverride(),
  factor: createNoopMovementFactor(),
  updateInterval: 50,
  motion: 1,
  magnification: 100,
  color: '#000000', // black
  opacity: 1,
  ...mod,
});

const cloneStagingState = (staging: StagingState) => ({
  ...staging,
  staged: cloneStaged(staging.staged),
});

const cloneStaged = (staged: Staged) => {
  return staged.map(({ pal, mod }) => ({ pal, mod: { ...mod } }));
};

/* -------------------------------------
 * Persistent storage interface logic
 * ------------------------------------- */

function stagedFromExhibited(
  pals: Palamander[],
  staged: Staged,
  exhibited: Exhibited,
): Staged {
  return exhibited.map(({ type, mod }, i) => {
    const palIndex = pals.findIndex((pal) => pal.type == type);
    if (palIndex == -1) return staged[i];
    return { pal: { ...pals[palIndex] }, mod };
  });
}

function exhibitedFromStaged(staged: Staged): Exhibited {
  return staged.map(({ pal, mod }) => ({
    type: pal?.type ?? '',
    mod,
  }));
}

/* --------------------------------------------
 * StagingState Reducer and Associated logic
 * -------------------------------------------- */

type StagingStateAction =
  | { type: 'OVERWRITE'; pals: Palamander[]; exhibited: Exhibited }
  | { type: 'TOGGLE'; index: number }
  | { type: 'ACTIVATE'; index: number }
  | { type: 'SET'; pals: Palamander[]; key: string }
  | { type: 'MODIFY'; index: number; mod: PalModifier };

function reduceStaging(
  staging: StagingState,
  action: StagingStateAction,
): StagingState {
  switch (action.type) {
    case 'OVERWRITE':
      return overwrite(staging, action.pals, action.exhibited);
    case 'TOGGLE':
      return toggleSelect(staging, action.index);
    case 'ACTIVATE':
      return activate(staging, action.index);
    case 'SET':
      return set(staging, action.pals, action.key);
    case 'MODIFY':
      return modify(staging, action.index, action.mod);
    default:
      return cloneStagingState(staging);
  }
}

function overwrite(
  staging: StagingState,
  pals: Palamander[],
  exhibited: Exhibited,
): StagingState {
  return {
    ...staging,
    staged: stagedFromExhibited(pals, staging.staged, exhibited),
  };
}

function toggleSelect(staging: StagingState, index: number): StagingState {
  const selected = staging.selected == index ? -1 : index;
  return {
    ...cloneStagingState(staging),
    selected,
    active: selected,
  };
}

function activate(staging: StagingState, index: number): StagingState {
  if (staging.selected > -1) return cloneStagingState(staging);
  return {
    ...cloneStagingState(staging),
    active: index,
  };
}

function set(
  staging: StagingState,
  pals: Palamander[],
  type: string,
): StagingState {
  const palIndex = pals.findIndex((pal) => pal.type == type);
  const staged = cloneStaged(staging.staged);
  const prevType = staging.staged[staging.selected].pal?.type;
  if (type != prevType) {
    staged[staging.selected] = {
      pal: palIndex < 0 ? undefined : { ...pals[palIndex] },
      mod: initMod(pals[palIndex].mod),
    };
  }
  return {
    staged,
    selected: -1,
    active: staging.active,
  };
}

function modify(
  staging: StagingState,
  index: number,
  mod: PalModifier,
): StagingState {
  const staged = cloneStaged(staging.staged);
  staged[index] = { pal: staged[index].pal, mod: { ...mod } };
  return {
    ...staging,
    staged,
  };
}

export type { StagingState, StagingStateAction };
export { initStagingState, reduceStaging, exhibitedFromStaged };
