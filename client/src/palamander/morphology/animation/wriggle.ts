import type { WriggleSpec } from './wriggle-spec.ts';
import type { Suppression } from './suppression.ts';

import { suppress } from './suppression.ts';

const FULL_CYCLE = 2 * Math.PI;

type Wriggle = WriggleComponent[];
type WriggleComponent = {
  // Static fields
  offset: number;
  acceleration: number;
  suppression: Suppression;
  progressPerElapsed: number;
  range: number;
  // Dynamic fields
  suppressed: number;
  progress: number;
  magnitude: number;
};

function compound(wriggle: Wriggle): number {
  return wriggle.reduce((acc, component) => acc + component.magnitude, 0);
}

function syncWriggle(
  wriggle: Wriggle,
  interval: number,
  speed: number,
): Wriggle {
  return wriggle.map((component) =>
    syncWriggleComponent(component, interval, speed),
  );
}

function syncWriggleComponent(
  wriggle: WriggleComponent,
  interval: number,
  speed: number,
): WriggleComponent {
  const accelerationFactor = 1 + wriggle.acceleration * (speed / 100);
  const progress =
    wriggle.progress +
    interval * wriggle.progressPerElapsed * accelerationFactor;
  const raw = Math.sin(wriggle.offset + progress) * wriggle.range;
  const { magnitude, suppressed } = suppress(
    wriggle.suppression,
    raw,
    wriggle.suppressed,
    speed,
    interval,
  );
  return {
    ...wriggle,
    suppression: { ...wriggle.suppression },
    progress,
    magnitude,
    suppressed,
  };
}

// Converts WriggleSpec to WriggleComponent.
function toWriggleComponent(spec: WriggleSpec): WriggleComponent {
  const squiggleIndexOffset = FULL_CYCLE * -spec.i * spec.squiggleRate;
  const offset = squiggleIndexOffset - (spec.offset ?? 0);

  const acceleration = spec.acceleration ?? 0.5; // default to 1.5x frequency at speed

  const suppression = spec.suppression ?? { delta: 0 };

  const progressPerElapsed = FULL_CYCLE / (spec.period * 1000); // how much cycle passes per ms
  const range = spec.synchronize ? spec.range * spec.i : spec.range; // range compounds when synced

  const suppressed = 0;
  const progress = 0;
  const magnitude = 0;
  return {
    offset,
    acceleration,
    suppression,
    progressPerElapsed,
    range,
    suppressed,
    progress,
    magnitude,
  };
}

// Convert each WriggleSpec -> WriggleComponent to form composite Wriggle.
function toWriggle(specs: Array<WriggleSpec>): Wriggle {
  return specs.map((spec: WriggleSpec) => toWriggleComponent(spec));
}

export type { Wriggle };
export { compound, syncWriggle, toWriggle };
