type WriggleSpec = {
  range: number; // peak degrees to wriggle up/down
  period: number; // time (s) to complete one wriggle
  i: number; // segment index
  squiggleRate: number; // squigs per section: 0 = no squiggle, 1/(section len) = 1 full squiggle
  synchronize: boolean; // synchonize wave
  acceleration?: number; // adjusts cycle period based on speed
  offset?: number; // offsets wriggle by constant amount, repeats every 2 PI
  suppress?: SpeedSuppression; // dampens wriggle magnitude based on speed magnitude
}

// Common, raw Wriggle Spec fields.
type WaveSpec = {
  range: number,
  period: number,
  offset?: number,
  acceleration?: number,
  suppress?: SpeedSuppression,
}

type SpeedSuppression = (angle: number, speed: number) => number;
type WriggleSpecGenerator = (i: number) => WriggleSpec[];
type SpeedSuppressionGenerator = (i: number) => SpeedSuppression;
const suppressNothing: SpeedSuppression = (angle: number, _: number,) => angle;

/* ------------------------------------------------------------
 * Wriggle Spec Creation Methods
 * ------------------------------------------------------------ */

// Creates a wriggle spec to all curl together, like an octopus or a starfish arm.
// If the range * (section length) >= 360, it will form a circle at (absolute) max curl.
function createCurlSpec(spec: WaveSpec, i: number): WriggleSpec {
  return {
    ...spec,
    i,
    squiggleRate: 0,
    synchronize: true,
  };
}

// Creates a wriggle spec to squiggle like a snake.
// For a full standing wave (the start and end segment in place while the rest squiggle between):
//   set the length to the length of the section.
// For a more realistic snake/tadpole wriggle, set it to half or less.
function createSquiggleSpec(spec: WaveSpec, i: number, length: number): WriggleSpec {
  return {
    ...spec,
    i,
    squiggleRate: 1/length,
    synchronize: false,
  };
}

// Keeps a section of segments in a perfect line, with the whole line rotating back and forth.
function createRotationSpec(spec: WaveSpec): WriggleSpec {
  return {
    ...spec,
    i: 0, // ignored
    squiggleRate: 0,
    synchronize: false,
  };
}

/* ------------------------------------------------------------
 * WriggleSpec Generators
 * ------------------------------------------------------------ */

function injectWriggleSupression(
    wriggleSpecGenerator: WriggleSpecGenerator,
    supressionGenerator: SpeedSuppressionGenerator): WriggleSpecGenerator {
  return (i: number) => {
    return wriggleSpecGenerator(i).map((spec) => {
      spec.suppress = supressionGenerator(i);
      return spec;
    });
  }
}

function generateSquiggleGradientSpec(
    count: number,
    spec: WaveSpec,
    initialRange: number,
    easeFactor: number): WriggleSpecGenerator {
  const squiggleFactorByI = (i: number) => (count - i - 1) / Math.max(1, count-1);
  return (i: number) => {
    let range = spec.range - squiggleFactorByI(i) * (spec.range-initialRange);
    if (i == 0) range *= easeFactor
    return [ createSquiggleSpec({ ...spec, range }, i, count*2) ];
  };
}

function generateTuckAtSpeed(angle: number, tuckTowards: number, tuckFactor: number): SpeedSuppression {
  let fullTuck = (angle - tuckTowards) * tuckFactor;
  return (angle: number, speed: number): number => angle - fullTuck * speed / 100;
}

function generateSupressionGradient(
    count: number,
    range: { front: number, back: number }): SpeedSuppressionGenerator {
  const suppressByI = (i: number) => range.front + i*(range.back-range.front) / Math.max(1, count-1);
  return (i: number) => {
    return (angle: number, speed: number): number => angle * (1 - speed / 100 * suppressByI(i));
  };
}

export type { WriggleSpec, WaveSpec }
export {
  createCurlSpec,
  createSquiggleSpec,
  createRotationSpec,
  suppressNothing,
  injectWriggleSupression,
  generateSquiggleGradientSpec,
  generateTuckAtSpeed,
  generateSupressionGradient
}