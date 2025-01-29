type SampleSpec = {
  range: SampleRange,
  zero: number; // odds the sample is set straight to zero
  mirror: boolean; // whether sample space should be mirrored in the negative direction
}

type SampleRange = {
  min: number; // lower limit
  max: number; // upper limit
  skewMin?: number; // bias towards lower values - will sample skewMin extra and take min
}

type TimedSampler = (interval: number) => number;
type Sampler = () => number;

// Samples from a range, skewing towards the min by taking the lowest from skewCount+1.
function sampleSkewedMin(range: SampleRange): number {
  const skew = range.skewMin ?? 0;
  // Fill array with skewCount+1 random numbers and take the smallest.
  const r = Math.min(Math.random(), ...[...Array(skew)].map(_=>Math.random()));
  return range.min + range.max*r;
}

function generateSampler(spec: SampleSpec): Sampler {
  return () => {
    // Set to zero with some given probability - otherwise sample.
    const magnitude = Math.random() < spec.zero ? 0 : sampleSkewedMin(spec.range);
    if (!spec.mirror) return magnitude;

    // Equally likely to be mirrored around 0
    const direction = Math.random() < 0.5 ? -1 : 1;
    return magnitude * direction;
  }
}

// Generates a function to call repeatedly in order to get the specified sample.
// Sampled value persists if corresponding sampled interval has not been exceeded.
// Sampled value (and sampled interval) is replaced when original sampled interval is exceeded.
function generateGetSample(sample: Sampler, sampleInterval: Sampler): TimedSampler {
  let countdown = 0;
  let sampledVal = 0;
  return (interval: number) => {
    if (interval <= countdown) {
      countdown -= interval;
      return sampledVal;
    }
    const componentPrev = sampledVal * countdown / interval;
    sampledVal = sample();
    const component = sampledVal * (interval - countdown) / interval;
    countdown = sampleInterval() - countdown;

    // A weighted average is a reasonable approximation, but not mathematically perfect.
    return component + componentPrev;
  }
}

export { generateGetSample, generateSampler };
export type { SampleSpec, SampleRange, TimedSampler };