import type { MovementFactor, MovementOverride } from './movement/movement.ts';

// Configurable fields to dynamically modify pal look & behavior
type PalModifier = {
  override: Override;
  factor: MovementFactor;
  updateInterval: number;
  magnification: number;
  color: string;
};

type Override = {
  freeze: boolean;
  move: MovementOverride;
};

export const createFallbackMod = () => ({
  override: { freeze: false, move: { linear: {}, rotational: {} } },
  factor: { linear: 1, rotational: 1, interval: 1 },
  updateInterval: 50,
  magnification: 100,
  color: 'teal',
});

export const createNoopOverride = () => ({
  freeze: false,
  move: { linear: {}, rotational: {} },
});

export const createPointedOverride = (angle: number) => ({
  freeze: false,
  move: { linear: { velocity: 0 }, rotational: {}, angle },
});

export const createStillOverride = () => ({
  freeze: false,
  move: { linear: { velocity: 0 }, rotational: { velocity: 0 } },
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
