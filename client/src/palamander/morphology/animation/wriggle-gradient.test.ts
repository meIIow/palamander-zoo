import type { SquiggleGradient } from './wriggle-gradient.ts';

import { expect, describe, it } from 'vitest';

import { toSquiggleGenerator } from './wriggle-gradient.ts';

// type WriggleComponent = {
//   // Static fields
//   offset: number;
//   acceleration: number;
//   suppression: Suppression;
//   progressPerElapsed: number;
//   range: number;
//   // Dynamic fields
//   suppressed: number;
//   progress: number;
//   magnitude: number;
// };

// type WaveSpec = {
//   range: number; // peak degrees to wriggle up/down
//   period: number; // time (s) to complete one wriggle
//   acceleration?: number; // adjusts cycle period at speed
//   offset?: number; // offsets wriggle by constant amount, repeats every 2 PI
//   suppression?: Suppression; // dampens/tucks wriggle magnitude at speed
// };

// type SquiggleGradient = {
//   wave: WaveSpec;
//   count: number;
//   length: number;
//   angle: number;
//   easeFactor: number; // factor to dampen range of initial segment
//   increase: number; // how much range increases between first and last segment
//   suppression?: SuppressionGradient;
// };

// type SuppressionGradient = {
//   range?: { front: number; back: number };
//   tuckTarget?: number;
//   tuckFactor?: number;
// };

describe('SquiggleGradient', () => {
  const basicGradient: SquiggleGradient = {
    wave: {
      range: 30,
      period: 1,
    },
    count: 1,
    length: 2,
    angle: 0,
    easeFactor: 1,
    increase: 0,
  };
  describe('adjusts range evenly', () => {
    it('when increase is positive', () => {
      const generator = toSquiggleGenerator({
        ...basicGradient,
        count: 3,
        increase: 20,
      });
      expect(generator(0)[0].range).toEqual(20);
      expect(generator(1)[0].range).toEqual(30);
      expect(generator(2)[0].range).toEqual(40);
    });
    it('when increase is negative', () => {});
    it('when count is even', () => {});
  });

  it('dampens initial segment range based on easeFactor', () => {});

  it('offsets segment waves by inverse of length', () => {});

  describe('suppresses', () => {
    describe('by dampening evenly', () => {
      it('when count is even', () => {});
      it('when count is odd', () => {});
    });
    describe('by tucking', () => {
      it('for tuckFactor when it is specified', () => {});
      it('halway to angle when tuckFactor is not specified', () => {});
    });
    describe('without', () => {
      it('tucking when tuckAngle is not specified', () => {});
      it('dampening when range is not specified', () => {});
    });
  });
});
