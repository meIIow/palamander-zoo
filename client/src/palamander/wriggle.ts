type Wriggle = (count: number) => number;

type WriggleSpec = {
  range: number; // peak degrees to wriggle up/down
  period: number; // time (s) to complete one wriggle
  i: number; // segment index
  squiggleRate: number; // squigs per section: 0 = no squiggle, 1/(section len) = 1 full squiggle
  offset: number; // offsets wriggle by constant amount, repeats every 2 PI
  synchronize: boolean; // synchonize wave
}

// Creates a wriggle spec to all curl together, like an octopus or a starfish arm.
// If the range * (section length) >= 360, it will form a circle at (absolute) max curl.
function generateCurlSpec(range: number, period: number, i: number, offset=0): WriggleSpec {
  return {
    range,
    period,
    i,
    squiggleRate: 0,
    offset,
    synchronize: true,
  };
}

// Creates a wriggle spec to squiggle like a snake.
// For a full standing wave (the start and end segment in place while the rest squiggle between):
//   set the length to the length of the section.
// For a more realistic snake/tadpole wriggle, set it to half or less.
function generateSquiggleSpec(range: number, period: number, i: number, length: number, offset=0): WriggleSpec {
  return {
    range,
    period,
    i,
    squiggleRate: 1/length,
    offset,
    synchronize: false,
  };
}

// Keeps a section of segments in a perfect line, with the whole line rotating back and forth.
function generateRotationSpec(range: number, period: number, offset=0): WriggleSpec {
  return {
    range,
    period,
    i: 0, // ignored
    squiggleRate: 0,
    offset,
    synchronize: false,
  };
}

// Generalized Wriggle Generator.
// Could break into a few wriggle behaviors, but this works better when deriving from json spec.
function generateWriggle(spec: WriggleSpec): Wriggle {
  const intervalMult = 2 * Math.PI / spec.period / 1000;
  const squiggleOffset = 2 * Math.PI * spec.i * spec.squiggleRate;
  const rangeMult = spec.synchronize ? spec.range*spec.i : spec.range;
  return (interval: number) => {
    return Math.sin(spec.offset + squiggleOffset + interval*intervalMult) * rangeMult;
  };
}

// Combines wriggles into a super wriggle. Useful if we want a rotation and a curl/squiggle.
function generateCompositeWriggle(specs: Array<WriggleSpec>): Wriggle {
  const wriggles = specs.map((spec: WriggleSpec) => generateWriggle(spec));
  return (interval: number) => wriggles.reduce((acc, wriggle) => acc + wriggle(interval), 0);
}

export {
  generateCurlSpec,
  generateSquiggleSpec,
  generateRotationSpec,
  generateCompositeWriggle,
}

export type { Wriggle }