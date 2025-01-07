import { WriggleSpec , suppressNothing } from './wriggle-spec.ts'

type Wriggle = (time: number, interval: number, speed: number) => number;

// Generalized Wriggle Generator.
function generateWriggle(spec: WriggleSpec): Wriggle {
  const offset = spec.offset ?? 0;
  const suppress = spec.suppress ?? suppressNothing;
  const suppressionDelta = 2 * Math.abs(spec.range) / spec.period / 1000; // half as fast as avg wave
  const intervalMult = 2 * Math.PI / spec.period / 1000;
  const squiggleOffset = 2 * Math.PI * spec.i * spec.squiggleRate;
  const rangeMult = spec.synchronize ? spec.range*spec.i : spec.range;
  let suppressed = 0;
  return (time: number, interval: number, speed: number): number => {
    const wriggle = Math.sin(squiggleOffset - offset + time*intervalMult) * rangeMult;
    let suppression = wriggle - suppress(wriggle, speed);
    const delta = suppressionDelta * interval;
    suppression = Math.max(Math.min(suppression, suppressed+delta), suppressed-delta);
    suppressed = suppression;
    return wriggle// - suppressed;
  };
}

// Combines wriggles into a super wriggle. Useful if we want a rotation and a curl/squiggle.
function generateCompositeWriggle(specs: Array<WriggleSpec>): Wriggle {
  const wriggles = specs.map((spec: WriggleSpec) => generateWriggle(spec));
  return (time: number, interval: number, speed: number) => {
    return wriggles.reduce((acc, wriggle) => acc + wriggle(time, interval, speed), 0);
  };
}

export type { Wriggle }
export { generateWriggle, generateCompositeWriggle }