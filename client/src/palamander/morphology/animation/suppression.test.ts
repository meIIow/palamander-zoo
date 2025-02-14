import type { Suppression } from './suppression.ts';

import { expect, describe, it } from 'vitest';

import { calculateTuck, calculateDampen, suppress } from './suppression.ts';

describe('tuck', () => {
  it('value is zero when angle and target are equal', () => {
    expect(calculateTuck(45, 45, 0.5)).toEqual(0);
    expect(calculateTuck(45, 45, 0.1)).toEqual(0);
    expect(calculateTuck(45, 45, 0.9)).toEqual(0);
  });

  it('value is positive when target is less than angle', () => {
    expect(calculateTuck(90, 0, 0.5)).toEqual(-45);
  });

  it('value is positive when target is greater than angle', () => {
    expect(calculateTuck(0, 90, 0.5)).toEqual(45);
  });

  it('value is toward zero axis when angle is negative and target >= 0', () => {
    expect(calculateTuck(-90, 0, 0.5)).toEqual(45);
    expect(calculateTuck(-45, 45, 0.5)).toEqual(45);
  });
});

describe('dampen', () => {
  const count = 3;
  const range = { front: 10, back: 20 };
  it('value of first element is the front range', () => {
    expect(calculateDampen(0, count, range)).toEqual(range.front);
  });

  it('value of final element is the back range', () => {
    expect(calculateDampen(count - 1, count, range)).toEqual(range.back);
  });

  it('is halfway from front to back range for midway element', () => {
    expect(calculateDampen(1, count, range)).toEqual(15);
  });
});

describe('suppress', () => {
  const interval = 50; // ms
  const angle = 90; // degrees
  const noopDelta = 1000; // (degrees / ms), too high to affect suppression

  const stopped = 0;
  const moving = 50;
  const speeding = 100;

  describe('does nothing', () => {
    const expectDoesNothing = (suppression: Suppression) => {
      let suppressed = suppress(
        suppression,
        angle,
        0,
        stopped,
        interval,
      ).suppressed;
      expect(suppressed).toEqual(0);
      suppressed = suppress(suppression, angle, 0, moving, interval).suppressed;
      expect(suppressed).toEqual(0);
      suppressed = suppress(
        suppression,
        angle,
        0,
        speeding,
        interval,
      ).suppressed;
      expect(suppressed).toEqual(0);
    };

    it('when dampen and tuck are undefined', () => {
      const suppression: Suppression = { delta: noopDelta };
      expect(suppression.tuck).toBeUndefined();
      expect(suppression.dampen).toBeUndefined();
      expectDoesNothing(suppression);
    });

    it('when tuck and dampen are zero', () => {
      const suppression = {
        delta: noopDelta,
        tuck: 0,
        dampen: 0,
      };
      expectDoesNothing(suppression);
    });

    it('when delta is set to zero', () => {
      const suppression = {
        delta: 0,
        dampen: 1,
        tuck: 45,
      };
      expectDoesNothing(suppression);
    });
  });

  it('tucks halway when speed is halfway', () => {
    const suppression = {
      delta: noopDelta,
      tuck: -angle,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      moving,
      interval,
    );
    expect(magnitude).toEqual(angle / 2);
    expect(suppressed).toEqual(angle / 2);
  });

  it('tucks fully when speed is full', () => {
    const suppression = {
      delta: noopDelta,
      tuck: -angle,
    };

    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(0);
    expect(suppressed).toEqual(angle);
  });

  it('halves wriggle at speed when dampen is 0.5', () => {
    const suppression = {
      delta: noopDelta,
      dampen: 0.5,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(angle / 2);
    expect(suppressed).toEqual(angle / 2);
  });

  it('removes wriggle at speed when dampen is 1', () => {
    const suppression = {
      delta: noopDelta,
      dampen: 1,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(0);
    expect(suppressed).toEqual(angle);
  });

  it('doubles wriggle at speed when dampen is -1', () => {
    const suppression = {
      delta: noopDelta,
      dampen: -1,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(angle * 2);
    expect(suppressed).toEqual(-angle);
  });

  it('dampens before tucking', () => {
    // Dampens to 0, then tucks to -45. If reversed, would tuck to 45 then dampen to 0.
    const suppression = {
      delta: noopDelta,
      dampen: 1,
      tuck: -45,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(-45);
    expect(suppressed).toEqual(135);
  });

  it('clips suppression when negative', () => {
    const suppression = {
      delta: 30 / interval, // will allow 30 degrees of supression
      tuck: -90,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(60);
    expect(suppressed).toEqual(30);
  });

  it('clips suppression when positive', () => {
    const suppression = {
      delta: 30 / interval, // will allow 30 degrees of supression
      tuck: 90,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      0,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(120);
    expect(suppressed).toEqual(-30);
  });

  it('clips suppression less when building on existing suppression', () => {
    const prevSuppression = 30;
    const suppression = {
      delta: 30 / interval, // will allow 30 degrees of supression
      tuck: -90,
    };
    const { magnitude, suppressed } = suppress(
      suppression,
      angle,
      prevSuppression,
      speeding,
      interval,
    );
    expect(magnitude).toEqual(30);
    expect(suppressed).toEqual(60);
  });
});
