import type { WriggleSpec, SpeedSuppression } from './wriggle-spec.ts';
import { suppressNothing } from './wriggle-spec.ts';

const FULL_CYCLE = 2 * Math.PI;

type Wriggle = WriggleComponent[];
type WriggleComponent = {
  // Static fields
  offset: number;
  accelerate: (speed: number) => number;
  suppress: SpeedSuppression;
  suppressionDelta: number;
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
  const progress =
    wriggle.progress +
    interval * wriggle.progressPerElapsed * wriggle.accelerate(speed);
  let magnitude = Math.sin(wriggle.offset + progress) * wriggle.range;
  let suppression = magnitude - wriggle.suppress(magnitude, speed);
  const delta = wriggle.suppressionDelta * interval;
  suppression = Math.max(
    Math.min(suppression, wriggle.suppressed + delta),
    wriggle.suppressed - delta,
  );
  const suppressed = suppression;
  magnitude -= suppressed;
  return {
    ...wriggle,
    suppressed,
    progress,
    magnitude,
  };
}

// Converts WriggleSpec to WriggleComponent.
function createWriggleComponent(spec: WriggleSpec): WriggleComponent {
  const squiggleIndexOffset = FULL_CYCLE * -spec.i * spec.squiggleRate;
  const offset = squiggleIndexOffset - (spec.offset ?? 0);

  const acceleration = spec.acceleration ?? 0.5; // default to 1.5x frequency at speed
  const accelerate = (speed: number) => 1 + acceleration * (speed / 100);

  const suppress = spec.suppress ?? suppressNothing;
  const suppressionDelta = Math.abs(spec.range) / spec.period / 1000; // 4x slower than avg wave

  const progressPerElapsed = FULL_CYCLE / (spec.period * 1000); // how much cycle passes per ms
  const range = spec.synchronize ? spec.range * spec.i : spec.range; // range compounds when synced

  const suppressed = 0;
  const progress = 0;
  const magnitude = 0;
  return {
    offset,
    accelerate,
    suppress,
    suppressionDelta,
    progressPerElapsed,
    range,
    suppressed,
    progress,
    magnitude,
  };
}

// Combines wriggles into a super wriggle. Useful if we want a rotation and a curl/squiggle.
function generateCompositeWriggle(specs: Array<WriggleSpec>): Wriggle {
  return specs.map((spec: WriggleSpec) => createWriggleComponent(spec));
}

export type { Wriggle };
export { compound, syncWriggle, generateCompositeWriggle };
