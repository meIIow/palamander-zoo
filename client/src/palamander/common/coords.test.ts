import { expect, describe, it } from 'vitest';
import { createOrigin, shiftNegative, round, toVector } from './coords.js';

describe('negative shift', () => {
  const origin = createOrigin();
  const mixed = { x: 5, y: -5 };
  const neg_five = { x: -5, y: -5 };
  const five = { x: 5, y: 5 };
  const ten = { x: 10, y: 10 };
  const fifteen = { x: 15, y: 15 };

  it('by identical coordinate results in origin', () => {
    expect(shiftNegative(mixed, mixed)).toEqual(origin);
  });

  it('by positive coordinate will decrease', () => {
    expect(shiftNegative(ten, five)).toEqual(five);
  });

  it('by negavite coordinate will increase', () => {
    expect(shiftNegative(ten, neg_five)).toEqual(fifteen);
  });
});

describe('rounding coordinates', () => {
  it('shaves to three decimal places', () => {
    expect(round({ x: 3.3333, y: 3.3333 })).toEqual({ x: 3.333, y: 3.333 });
  });

  it('rouns up if fourth decimal is gr-et 5', () => {
    expect(round({ x: 5.5555, y: 5.5555 })).toEqual({ x: 5.556, y: 5.556 });
  });
});

describe('vector conversion', () => {
  it('points up (all magnitude as negative y) when angle is zero', () => {
    const upVector = toVector(1, 0);
    expect(upVector.x).toBeCloseTo(0);
    expect(upVector.y).toBeCloseTo(-1);
  });

  it('points right (all magnitude as negative x) when angle is 90', () => {
    const upVector = toVector(1, 90);
    expect(upVector.x).toBeCloseTo(-1);
    expect(upVector.y).toBeCloseTo(0);
  });
});
