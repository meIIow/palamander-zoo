import { VelocitySampleSpec } from './velocity.ts';

type VelocitySampleSpecGenerator = () => VelocitySampleSpec;

// A map from a behavior ID to its corresponding behavior generator.
interface BehaviorMap {
  [key: string]: VelocitySampleSpecGenerator;
}

function wrapBehaviorMap(
  map: BehaviorMap,
  behavior: string,
): VelocitySampleSpec {
  let key = behavior;
  if (!(key in map)) {
    console.log(
      `${key} not present in sample map, falling back to placeholder.`,
    );
    key = 'placeholder';
  }
  return map[key]();
}

export type { BehaviorMap, VelocitySampleSpecGenerator };
export { wrapBehaviorMap };
