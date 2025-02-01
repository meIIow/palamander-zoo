import { SampleSpec, generateSampler, generateTimedSampler } from './sample.ts';

type VelocitySampleSpec = {
  limit: VelocityLimit,
  velocity: SampleSpec;
  interval: SampleSpec,
}

type VelocityLimit = {
  velocity: number,
  accel: number,
  decel: number,
};

type VelocityIntegral = {
  distance: number,
  velocity: number,
}

type VelocityOverride = Partial<VelocityIntegral>
type VelocityIntegralSampler = (interval: number, factor: number, override: VelocityOverride) => VelocityIntegral;

// Clip velocity if (acc/dec)eleration are outside max range for this interval.
function clipVelocity(curr: number, prev: number, limit: VelocityLimit): number {
  if (prev - curr > limit.decel) return prev-limit.decel;
  if (curr - prev > limit.accel) return prev+limit.accel;
  return curr;
}

function generateSampleVelocity(spec: VelocitySampleSpec): VelocityIntegralSampler {
  const limit = { ...spec.limit };
  const intervalSampler = generateSampler(spec.interval);
  const velocitySampler = generateSampler(spec.velocity);
  const sample = generateTimedSampler(velocitySampler, intervalSampler);
  let prevVelocity = 0;
  return (interval: number, factor: number, override: VelocityOverride) => {
    const velocity = override.velocity ?? clipVelocity(sample(interval), prevVelocity, limit);
    const distance = override.distance ?? (interval / 1000) * (velocity / 100) * limit.velocity * factor;
    return { velocity, distance };
  }
}

export type { VelocityIntegral, VelocityOverride, VelocityIntegralSampler, VelocitySampleSpec, VelocityLimit }
export { generateSampleVelocity }