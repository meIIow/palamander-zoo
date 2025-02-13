import { SampleSpec, generateSampler, generateTimedSampler } from './sample.ts';

type VelocitySampleSpec = {
  limit: VelocityLimit;
  velocity: SampleSpec;
  interval: SampleSpec;
};

type VelocityLimit = {
  velocity: number;
  accel: number;
  decel: number;
};

type VelocityIntegral = {
  distance: number;
  velocity: number;
};

type VelocityOverride = Partial<VelocityIntegral>;
type VelocityIntegralSampler = (
  interval: number,
  intervalFactor: number,
  factor: number,
  override: VelocityOverride,
) => VelocityIntegral;

// Clip velocity if (acc/dec)eleration are outside max range for this interval.
function clipVelocity(
  curr: number,
  prev: number,
  limit: VelocityLimit,
  effectiveInterval: number,
): number {
  const decel = (limit.decel * effectiveInterval) / 1000;
  const accel = (limit.accel * effectiveInterval) / 1000;
  if (prev - curr > decel) return prev - decel;
  if (curr - prev > accel) return prev + accel;
  return curr;
}

function generateSampleVelocity(
  spec: VelocitySampleSpec,
): VelocityIntegralSampler {
  const limit = { ...spec.limit };
  const intervalSampler = generateSampler(spec.interval);
  const velocitySampler = generateSampler(spec.velocity);
  const sample = generateTimedSampler(velocitySampler, intervalSampler);
  let prevVelocity = 0;
  return (
    interval: number,
    intervalFactor: number,
    factor: number,
    override: VelocityOverride,
  ) => {
    const effectiveInterval = interval * intervalFactor;
    const velocity =
      override.velocity ??
      clipVelocity(
        sample(effectiveInterval),
        prevVelocity,
        limit,
        effectiveInterval,
      );
    const distance =
      override.distance ??
      (interval / 1000) * (velocity / 100) * limit.velocity * factor;
    prevVelocity = velocity;
    return { velocity, distance };
  };
}

export type {
  VelocityIntegral,
  VelocityOverride,
  VelocityIntegralSampler,
  VelocitySampleSpec,
  VelocityLimit,
};
export { generateSampleVelocity };
