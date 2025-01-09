import { WriggleSpec , suppressNothing } from './wriggle-spec.ts'

const FULL_CYCLE = 2 * Math.PI;
type Wriggle = (interval: number, speed: number) => number;

// Generalized Wriggle Generator.
function generateWriggle(spec: WriggleSpec): Wriggle {
  const squiggleIndexOffset = FULL_CYCLE * -spec.i * spec.squiggleRate; 
  const offset = squiggleIndexOffset - (spec.offset ?? 0);

  const acceleration = (spec.acceleration ?? 0.5); // default to 1.5x frequency at speed
  const accelerate = (speed: number) => 1 + acceleration * (speed / 100);

  const suppress = spec.suppress ?? suppressNothing;
  const suppressionDelta = Math.abs(spec.range) / spec.period / 1000; // 4x slower than avg wave

  const progressPerElapsed = FULL_CYCLE / (spec.period * 1000); // how much cycle passes per ms
  const range = spec.synchronize ? spec.range*spec.i : spec.range; // range compounds when synced

  let suppressed = 0;
  let progress = 0;
  return (interval: number, speed: number): number => {
    progress += interval * progressPerElapsed * accelerate(speed);
    const wriggle = Math.sin(offset + progress) * range;
    let suppression = wriggle - suppress(wriggle, speed);
    const delta = suppressionDelta * interval;
    suppression = Math.max(Math.min(suppression, suppressed+delta), suppressed-delta);
    suppressed = suppression;
    return wriggle - suppressed;
  };
}

// Combines wriggles into a super wriggle. Useful if we want a rotation and a curl/squiggle.
function generateCompositeWriggle(specs: Array<WriggleSpec>): Wriggle {
  const wriggles = specs.map((spec: WriggleSpec) => generateWriggle(spec));
  return (interval: number, speed: number) => {
    return wriggles.reduce((acc, wriggle) => acc + wriggle(interval, speed), 0);
  };
}

export type { Wriggle }
export { generateWriggle, generateCompositeWriggle }