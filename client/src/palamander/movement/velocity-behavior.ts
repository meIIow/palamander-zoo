import { SampleSpec } from './movement-sample.ts';

type VelocityBehaviorSpec = {
  limit: VelocityLimit,
  velocity: SampleSpec;
  interval: SampleSpec,
}

type VelocityBehaviorSpecGenerator = () => VelocityBehaviorSpec;

type VelocityLimit = {
  velocity: number,
  accel: number,
  decel: number,
};

// A map from a movement ID to its corresponding behavior generator.
interface BehaviorMap {
  [key: string]: VelocityBehaviorSpecGenerator;
}

function accessBehaviorMap(map: BehaviorMap, behavior: string): VelocityBehaviorSpec {
  let key = behavior;
  if (!(key in map)) {
    console.log(`${key} not present in sample map, falling back to placeholder.`);
    key = 'placeholder';
  }
  return map[key]();
}

export type { BehaviorMap, VelocityLimit, VelocityBehaviorSpecGenerator, VelocityBehaviorSpec };
export { accessBehaviorMap };