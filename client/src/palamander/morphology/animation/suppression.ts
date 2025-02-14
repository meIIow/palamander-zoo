type Suppression = {
  dampen?: number; // multiply animation magnitude by this factor at speed
  tuck?: number; // rotate towards this angle at speed
  delta: number; // max change (degrees / ms) b/w natural and supressed angle
};

type Suppressed = {
  magnitude: number;
  suppressed: number;
};

function suppress(
  suppression: Suppression,
  angle: number,
  prevSuppressed: number,
  speed: number,
  interval: number,
): Suppressed {
  const dampened =
    !suppression.dampen ? angle : dampen(angle, suppression.dampen, speed);
  const tucked =
    !suppression.tuck ? dampened : tuck(dampened, suppression.tuck, speed);
  const max = interval * suppression.delta;
  const suppressed = Math.max(
    Math.min(angle - tucked, prevSuppressed + max),
    prevSuppressed - max,
  );
  return {
    magnitude: angle - suppressed,
    suppressed,
  };
}

function tuck(angle: number, tuck: number, speed: number): number {
  return angle + tuck * (speed / 100);
}

function dampen(angle: number, factor: number, speed: number): number {
  return angle * (1 - (speed / 100) * factor);
}

function calculateTuck(angle: number, target: number, factor: number): number {
  return (target - angle) * factor;
}

function calculateDampen(
  i: number,
  count: number,
  range: { front: number; back: number },
): number {
  const safeCountDivisor = Math.max(1, count - 1);
  return range.front + (range.back - range.front) * (i / safeCountDivisor);
}

function calculateDelta(range: number, period: number): number {
  return (4 * Math.abs(range)) / period / 1000; // average full wave delta
}

function createSuppression(range: number, period: number): Suppression {
  return {
    delta: calculateDelta(range, period),
  };
}

export type { Suppression, Suppressed };
export { createSuppression, calculateTuck, calculateDampen, suppress };
