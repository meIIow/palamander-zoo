import { VelocityLimit, VelocityBehavior } from './velocity-behavior.ts'

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

function generateSampleVelocity(behavior: VelocityBehavior): VelocityIntegralSampler {
  const limit = { ...behavior.limit };
  const sample = behavior.sampler;
  let prevVelocity = 0;
  return (interval: number, factor: number, override: VelocityOverride) => {
    const velocity = override.velocity ?? clipVelocity(sample(interval), prevVelocity, limit);
    const distance = override.distance ?? (interval / 1000) * (velocity / 100) * limit.velocity * factor;
    return { velocity, distance };
  }
}

export type { VelocityIntegral, VelocityOverride, VelocityIntegralSampler }
export { generateSampleVelocity }