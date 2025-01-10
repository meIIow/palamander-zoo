import { speedMap } from './speed-behavior.ts';
import { rotationMap } from './rotation-behavior.ts';
import { VelocityBehaviorInput, VelocityBehavior, accessBehaviorMap } from './velocity-behavior.ts';

type Behavior = {
  speed: VelocityBehavior, // linear velocity movement behavior
  rotation: VelocityBehavior, // angular velocity movement behavior
};

type BehaviorInput = {
  linear: VelocityBehaviorInput,
  angular: VelocityBehaviorInput,
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