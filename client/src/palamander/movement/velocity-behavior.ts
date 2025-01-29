import { TimedSampler, SampleSpec, generateSampler, generateGetSample } from './movement-sample.ts';

type VelocityBehaviorInput = {
  id: string;
  velocity: number;
  interval: number,
}

type VelocityBehaviorSpec = {
  limit: VelocityLimit,
  velocity: SampleSpec;
  interval: SampleSpec,
}

type VelocityBehaviorSpecGenerator = (velocity: number, interval: number) => VelocityBehaviorSpec;

type VelocityBehavior = {
  limit: VelocityLimit,
  sampler: TimedSampler,
};

type VelocityLimit = {
  velocity: number,
  accel: number,
  decel: number,
};

// A map from a movement ID to its corresponding behavior generator.
interface BehaviorMap {
  [key: string]: VelocityBehaviorSpecGenerator;
}

function accessBehaviorMap(map: BehaviorMap, input: VelocityBehaviorInput): VelocityBehavior {
  let key = input.id;
  if (!(key in map)) {
    console.log(`${key} not present in sample map, falling back to placeholder.`);
    key = 'placeholder';
  }
  const { limit, velocity, interval } = map[key](input.velocity, input.interval);
  const intervalSampler = generateSampler(interval);
  const velocitySampler = generateSampler(velocity);
  const sampler = generateGetSample(velocitySampler, intervalSampler);
  return { limit, sampler };
}

export type { BehaviorMap, VelocityBehaviorInput, VelocityBehavior, VelocityLimit, VelocityBehaviorSpecGenerator };
export { accessBehaviorMap };