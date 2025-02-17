import type { Suppression } from './suppression';
import type { WaveSpec } from './wriggle-spec';
import { Wriggle } from './wriggle.ts';

import {
  calculateDampen,
  calculateTuck,
  createSuppression,
} from './suppression';
import { createSquiggleSpec } from './wriggle-spec';
import { toWriggle } from './wriggle.ts';

type WriggleGenerator = (i: number) => Wriggle;

type SquiggleGradient = {
  wave: WaveSpec;
  count: number;
  length: number;
  angle: number;
  easeFactor: number; // factor to dampen range of initial segment
  increase: number; // how much range increases between first and last segment
  suppression?: SuppressionGradient;
};

type SuppressionGradient = {
  range?: { front: number; back: number };
  tuckTarget?: number;
  tuckFactor?: number;
};

const getFractionI = (i: number, count: number) => i / Math.max(1, count - 1);

function suppressAtIndex(
  i: number,
  count: number,
  angle: number,
  gradient: SuppressionGradient,
  wave: WaveSpec,
): Suppression {
  const suppression = {
    ...(wave.suppression ?? createSuppression(wave.range, wave.period)),
  };
  if (gradient.range)
    suppression.dampen = calculateDampen(i, count, gradient.range);
  if (gradient.tuckTarget != undefined)
    suppression.tuck = calculateTuck(
      angle,
      gradient.tuckTarget,
      gradient.tuckFactor ?? 0.5,
    );
  return suppression;
}

function toSquiggleGenerator(gradient: SquiggleGradient): WriggleGenerator {
  return (i: number) => {
    let range =
      gradient.wave.range -
      gradient.increase / 2 +
      getFractionI(i, gradient.count) * gradient.increase;
    if (i == 0) range *= gradient.easeFactor;
    const wave = { ...gradient.wave, range };
    if (gradient.suppression)
      wave.suppression = suppressAtIndex(
        i,
        gradient.count,
        gradient.angle,
        gradient.suppression,
        wave,
      );
    return toWriggle([createSquiggleSpec(wave, i, gradient.length)]);
  };
}

export type { SquiggleGradient, WriggleGenerator, SuppressionGradient };
export { toSquiggleGenerator };
