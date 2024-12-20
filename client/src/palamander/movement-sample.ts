type SampleSpec = {
  zero: number; // odds the sample is set straight to zero
  skewMin: number; // bias towards lower values - will sample skewMin extra and take min
  mirror: boolean; // whether sample space should be mirrored in the negative direction
}

// Samples from a range, skewing towards the min by taking the lowest from skewCount+1.
function sampleSkewedMin(min: number, max: number, skewCount=0) {
  // Fill array with skewCount+1 random numbers and take the smallest.
  const r = Math.min(Math.random(), ...[...Array(skewCount)].map(_=>Math.random()));
  return min + max*r;
}

function generateSampler(min: number, max: number, spec: SampleSpec): ()=>number {
  return () => {
    // Set to zero with some given probability - otherwise sample.
    const magnitude = Math.random() < spec.zero ? 0 : sampleSkewedMin(min, max, spec.skewMin);
    if (!spec.mirror) return magnitude;

    // Equally likely to be mirrored around 0
    const direction = Math.random() < 0.5 ? -1 : 1;
    return magnitude * direction;
  }
}

// function generateSampleSpeed(min: number, max: number, zero: number, skewCount=0): ()=>number {
//   // Set to zero with some given probability - otherwise sample.
//   return () => Math.random() < zero ? 0 : sampleSkewedMin(min, max, skewCount);
// }

// function generateSampleAngle(min: number, max: number, zero: number, skewCount=0): ()=>number {
//   return () => {
//     // Set to zero with some given probability - otherwise sample.
//     const magnitude = Math.random() < zero ? 0 : sampleSkewedMin(min, max, skewCount);
//     const direction = Math.random() < 0.5 ? -1 : 1; // equally likely to be (counter-)clockwise
//     return magnitude * direction;
//   }
// }

// function generateSampleInterval(min: number, max: number, skewCount=0): ()=>number {
//   return () => sampleSkewedMin(min, max, skewCount);
// }

// Generates a function to call repeatedly in order to get the specified sample
// Sampled value persists based on corresponding sampled interval.
function generateGetSample(sample: ()=>number, sampleInterval: ()=>number) {
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
export type { SampleSpec };