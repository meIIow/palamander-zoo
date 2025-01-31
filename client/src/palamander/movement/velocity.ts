import { VelocityLimit, VelocityBehaviorSpec } from './velocity-behavior.ts'
import { generateSampler, generateTimedSampler } from './movement-sample.ts';

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

function generateSampleVelocity(behavior: VelocityBehaviorSpec): VelocityIntegralSampler {
  const limit = { ...behavior.limit };
  const intervalSampler = generateSampler(behavior.interval);
  const velocitySampler = generateSampler(behavior.velocity);
  const sample = generateTimedSampler(velocitySampler, intervalSampler);
  let prevVelocity = 0;
  return (interval: number, factor: number, override: VelocityOverride) => {
    const velocity = override.velocity ?? clipVelocity(sample(interval), prevVelocity, limit);
    const distance = override.distance ?? (interval / 1000) * (velocity / 100) * limit.velocity * factor;
    return { velocity, distance };
  }
}

export type { VelocityIntegral, VelocityOverride, VelocityIntegralSampler }
export { generateSampleVelocity }