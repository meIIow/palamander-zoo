import type { Suppression } from './suppression';

// Common fields for defining Wriggle specifications.
type WaveSpec = {
  range: number; // peak degrees to wriggle up/down
  period: number; // time (s) to complete one wriggle
  acceleration?: number; // adjusts cycle period at speed
  offset?: number; // offsets wriggle by constant amount, repeats every 2 PI
  suppression?: Suppression; // dampens/tucks wriggle magnitude at speed
};

type WriggleSpec = WaveSpec & {
  i: number; // segment index
  squiggleRate: number; // fraction of a full wriggle each segment takes up
  synchronize: boolean; // synchonize wave
};

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
function createSquiggleSpec(
  spec: WaveSpec,
  i: number,
  length: number,
): WriggleSpec {
  return {
    ...spec,
    i,
    squiggleRate: 1 / length,
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

export type { WriggleSpec, WaveSpec };
export { createCurlSpec, createSquiggleSpec, createRotationSpec };
