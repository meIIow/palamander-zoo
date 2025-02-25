import type { MovementFactor, MovementOverride } from './movement/movement.ts';

// Configurable fields to dynamically modify pal look & behavior
type PalModifier = {
  override: Override;
  factor: MovementFactor;
  motion: number;
  updateInterval: number;
  magnification: number;
  color: string;
  opacity: number;
};

type Override = {
  freeze: boolean;
  move: MovementOverride;
};

export const createFallbackMod = () => ({
  override: { freeze: false, move: { linear: {}, rotational: {} } },
  factor: { linear: 1, rotational: 1, interval: 1 },
  motion: 1,
  updateInterval: 50,
  magnification: 100,
  color: 'black',
  opacity: 1,
});

export const createNoopOverride = () => ({
  freeze: false,
  move: { linear: {}, rotational: {} },
});

export const createPointedOverride = (angle: number) => ({
  freeze: false,
  move: { linear: { velocity: 20, distance: 0 }, rotational: {}, angle },
});

export const createStillOverride = () => ({
  freeze: false,
  move: { linear: { velocity: 20, distance: 0 }, rotational: { velocity: 0 } },
});

export const createSpinOverride = (spin: number) => ({
  freeze: false,
  move: { linear: { velocity: 0 }, rotational: { velocity: spin } },
});

export const createNoopMovementFactor = () => ({
  linear: 1,
  rotational: 1,
  interval: 1,
});

export type { PalModifier, Override };
