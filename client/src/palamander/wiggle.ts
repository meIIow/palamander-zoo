type Wiggle = (count: number) => number;

// Creates a wiggle function that squiggles a section of segments like a snake.
// For a full standing wave (the start and end segment in place while the rest squiggle between):
//   set the wavelength to the length of the section.
// For a more realistic snake/tadpole wiggle, set it to half or less.
function generatePropagatedWiggle(range: number, waveLength: number, segment: number): Wiggle {
  const sinCurveFractionMult = 2 * Math.PI / waveLength
  return (count: number) => range * Math.sin((count+segment) * sinCurveFractionMult);
}

// Keeps a section of segments in a perfect line, with the whole line wiggling back and forth.
function generateLinearWiggle(range: number, period: number, offset: number = 0): Wiggle {
  const sinCurveFractionMult = 2 * Math.PI / period
  return (count: number) => range * Math.sin((count + offset) * sinCurveFractionMult);
}

// Creats a wiggle that all curls together, like an octopus or a starfish.
// If the range * wavelength >= 360, it will form a circle at (absolute) max curl.
function generateSynchronizedWiggle(range: number, waveLength: number, segment: number, offset: number = 0): Wiggle {
  const sinCurveFractionMult = Math.PI / waveLength
  return (count: number) => range * Math.sin((count+offset) * sinCurveFractionMult) * (segment);
}

// Does not wiggle
const noWiggle: Wiggle = (_: number) => 0; // eslint-disable-line @typescript-eslint/no-unused-vars

export {
  generatePropagatedWiggle,
  generateLinearWiggle,
  generateSynchronizedWiggle,
  noWiggle,
}

export type { Wiggle }