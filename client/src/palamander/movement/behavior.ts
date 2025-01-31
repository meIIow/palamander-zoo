import { speedMap } from './speed-behavior.ts';
import { rotationMap } from './rotation-behavior.ts';
import { VelocityBehaviorSpec, accessBehaviorMap } from './velocity-behavior.ts';

type Behavior = {
  speed: VelocityBehaviorSpec, // linear velocity movement behavior
  rotation: VelocityBehaviorSpec, // angular velocity movement behavior
};

type BehaviorInput = {
  linear: string,
  angular: string,
};

/*
Behavior Ranges:
Focused vs Distractible (interval)
Squirrely vs Mellow (rotation)
Zippy vs Lazy
*/

function generateBehavior(behaviorInput: BehaviorInput) {
  return {
    speed: accessBehaviorMap(speedMap, behaviorInput.linear),
    rotation: accessBehaviorMap(rotationMap, behaviorInput.angular),
  }
}

export type { Behavior, BehaviorInput }
export { generateBehavior }