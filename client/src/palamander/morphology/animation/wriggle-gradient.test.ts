import type { SquiggleGradient } from './wriggle-gradient.ts';

import { expect, describe, it } from 'vitest';

import { toSquiggleGenerator } from './wriggle-gradient.ts';

describe('SquiggleGradient', () => {
  const basicGradient: SquiggleGradient = {
    wave: {
      range: 30,
      period: 1,
    },
    count: 2,
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
    it('when increase is negative', () => {
      const generator = toSquiggleGenerator({
        ...basicGradient,
        count: 3,
        increase: -20,
      });
      expect(generator(0)[0].range).toEqual(40);
      expect(generator(1)[0].range).toEqual(30);
      expect(generator(2)[0].range).toEqual(20);
    });
    it('when count is even', () => {
      const generator = toSquiggleGenerator({
        ...basicGradient,
        count: 4,
        increase: 30,
      });
      expect(generator(0)[0].range).toEqual(15);
      expect(generator(1)[0].range).toEqual(25);
      expect(generator(2)[0].range).toEqual(35);
      expect(generator(3)[0].range).toEqual(45);
    });
  });

  it('dampens only initial segment range based on easeFactor', () => {
    const generatorNotEased = toSquiggleGenerator({
      ...basicGradient,
    });
    const generatorHalfEased = toSquiggleGenerator({
      ...basicGradient,
      easeFactor: 0.5,
    });
    const generatorFullyEased = toSquiggleGenerator({
      ...basicGradient,
      easeFactor: 0,
    });
    expect(generatorNotEased(0)[0].range).toEqual(30);
    expect(generatorHalfEased(0)[0].range).toEqual(15);
    expect(generatorFullyEased(0)[0].range).toEqual(0);
    expect(generatorFullyEased(1)[0].range).toEqual(30); // only dampen initial
  });

  it('spreads full period offset evenly over "length" segments', () => {
    const generatorResetEveryThirdSegment = toSquiggleGenerator({
      ...basicGradient,
      count: 6,
      length: 3,
    });
    // With length = 3, every segment is offset by 1/3 of the (2pi long) period
    expect(
      generatorResetEveryThirdSegment(0)[0].offset -
        generatorResetEveryThirdSegment(1)[0].offset,
    ).toBeCloseTo((2 * Math.PI) / 3);
    expect(
      generatorResetEveryThirdSegment(1)[0].offset -
        generatorResetEveryThirdSegment(2)[0].offset,
    ).toBeCloseTo((2 * Math.PI) / 3);
    expect(
      generatorResetEveryThirdSegment(2)[0].offset -
        generatorResetEveryThirdSegment(3)[0].offset,
    ).toBeCloseTo((2 * Math.PI) / 3);
  });

  describe('suppresses', () => {
    describe('by dampening evenly', () => {
      it('when count is even', () => {
        const generator = toSquiggleGenerator({
          ...basicGradient,
          count: 4,
          suppression: { range: { front: 0.3, back: -0.3 } },
        });
        expect(generator(0)[0].suppression.dampen).toBeCloseTo(0.3);
        expect(generator(1)[0].suppression.dampen).toBeCloseTo(0.1);
        expect(generator(2)[0].suppression.dampen).toBeCloseTo(-0.1);
        expect(generator(3)[0].suppression.dampen).toBeCloseTo(-0.3);
      });
      it('when count is odd', () => {
        const generator = toSquiggleGenerator({
          ...basicGradient,
          count: 3,
          suppression: { range: { front: 0.3, back: -0.3 } },
        });
        expect(generator(0)[0].suppression.dampen).toBeCloseTo(0.3);
        expect(generator(1)[0].suppression.dampen).toBeCloseTo(0);
        expect(generator(2)[0].suppression.dampen).toBeCloseTo(-0.3);
      });
    });
    describe('by tucking', () => {
      it('for tuckFactor when it is specified', () => {
        const generator = toSquiggleGenerator({
          ...basicGradient,
          suppression: { tuckTarget: 30, tuckFactor: 0.4 },
        });
        expect(generator(0)[0].suppression.tuck).toBeCloseTo(12);
      });
      it('halway to angle when tuckFactor is not specified', () => {
        const generator = toSquiggleGenerator({
          ...basicGradient,
          suppression: { tuckTarget: 30 },
        });
        expect(generator(0)[0].suppression.tuck).toBeCloseTo(15);
      });
    });
    describe('without', () => {
      const generator = toSquiggleGenerator({
        ...basicGradient,
        suppression: {},
      });
      const suppression = generator(0)[0].suppression;
      it('tucking when tuckAngle is not specified', () => {
        expect(suppression.tuck).toBeUndefined;
      });
      it('dampening when range is not specified', () => {
        expect(suppression.dampen).toBeUndefined;
      });
    });
  });
});
