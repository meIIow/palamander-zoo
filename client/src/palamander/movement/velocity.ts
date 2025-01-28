import { VelocityLimit, VelocityBehavior } from "./velocity-behavior";

type MovementVector = {
  velocity: number,
  distance: number,
}

type VelocityFactor = {
  velocity: number,
  interval: number,
}

type VelocitySampler = (interval: number, factor: VelocityFactor) => MovementVector;

// Clip velocity if (acc/dec)eleration are outside max range for this interval.
function clipVelocity(curr: number, prev: number, limit: VelocityLimit): number {
  if (prev - curr > limit.decel) return prev-limit.decel;
  if (curr - prev > limit.accel) return prev+limit.accel;
  return curr;
}

function generateSampleVelocity(behavior: VelocityBehavior): VelocitySampler {
  const limit = { ...behavior.limit };
  const sample = behavior.sampler;
  let prevVelocity = 0;
  return (interval: number, factor: VelocityFactor) => {
    interval *= factor.interval;
    const velocity = clipVelocity(sample(interval), prevVelocity, limit);
    return {
      velocity,
      distance: (interval / 1000) * (velocity / 100) * limit.velocity * factor.velocity,
    };
  }
}

export type { MovementVector, VelocityFactor, VelocitySampler }
export { generateSampleVelocity }