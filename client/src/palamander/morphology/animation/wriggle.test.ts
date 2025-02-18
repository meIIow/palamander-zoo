import type { Wriggle } from './wriggle.ts';

import { expect, describe, it } from 'vitest';

import { syncWriggle } from './wriggle.ts';

describe('Wriggle sync', () => {
  const period = 1000; // ms
  const progress = Math.PI / 2;
  const basicWriggle: Wriggle = [
    {
      offset: 0,
      acceleration: 0,
      suppression: { delta: 0 },
      progressPerElapsed: (2 * Math.PI) / period,
      range: 30,
      // Dynamic fields
      suppressed: 0,
      progress: 0,
      magnitude: 0,
    },
  ];

  it('repeats magnitude every period', () => {
    const magnitudeCycleStart = syncWriggle(basicWriggle, progress, 0)[0]
      .magnitude;
    const magnitudeCycleEnd = syncWriggle(basicWriggle, progress + period, 0)[0]
      .magnitude;
    expect(magnitudeCycleStart).toBeCloseTo(magnitudeCycleEnd);
  });
  it('reverses magnitude every half period', () => {
    const magnitudeCycleStart = syncWriggle(basicWriggle, progress, 0)[0]
      .magnitude;
    const magnitudeCycleEnd = syncWriggle(
      basicWriggle,
      progress + 0.5 * period,
      0,
    )[0].magnitude;
    expect(magnitudeCycleStart).toBeCloseTo(-1 * magnitudeCycleEnd);
  });

  describe('with acceleration', () => {
    const wriggle = [
      {
        ...basicWriggle[0],
        acceleration: 1,
      },
    ];
    const progressNoAccel = syncWriggle(basicWriggle, progress, 100)[0]
      .progress;
    it('doubles progress at full speed', () => {
      const speed = 100;
      const progressWithAccel = syncWriggle(wriggle, progress, speed)[0]
        .progress;
      expect(2 * progressNoAccel).toBeCloseTo(progressWithAccel);
    });
    it('maintains progress at no speed', () => {
      const speed = 0;
      const progressWithAccel = syncWriggle(wriggle, progress, speed)[0]
        .progress;
      expect(progressNoAccel).toBeCloseTo(progressWithAccel);
    });
  });
  it('gains no progress with negative acceleration at speed', () => {
    const wriggle = [
      {
        ...basicWriggle[0],
        acceleration: -1,
      },
    ];
    const speed = 100;
    const progressWithNegAccel = syncWriggle(wriggle, progress, speed)[0]
      .progress;
    expect(progressWithNegAccel).toBeCloseTo(0);
  });
  it('maintains progress without acceleration at speed', () => {
    const wriggle = [
      {
        ...basicWriggle[0],
        acceleration: 1,
      },
    ];
    const speed = 0;
    const progressNoAccel = syncWriggle(basicWriggle, progress, speed)[0]
      .progress;
    const progressWithAccelNoSpeed = syncWriggle(wriggle, progress, speed)[0]
      .progress;
    expect(progressNoAccel).toBeCloseTo(progressWithAccelNoSpeed);
  });
});
