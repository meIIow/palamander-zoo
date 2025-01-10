import { speedMap } from './speed-behavior.ts';
import { rotationMap } from './rotation-behavior.ts';
import { VelocityBehaviorInput, VelocityBehavior, accessBehaviorMap } from './velocity-behavior.ts';

type Behavior = {
  speed: VelocityBehavior,
  rotation: VelocityBehavior,
};

/*
Behavior Ranges:
Focused vs Distractible (interval)
Squirrely vs Mellow (rotation)
Zippy vs Lazy
*/

function generateBehavior(speed: VelocityBehaviorInput, rotation: VelocityBehaviorInput) {
  return {
    speed: accessBehaviorMap(speedMap, speed),
    rotation: accessBehaviorMap(rotationMap, rotation),
  }
}

export type { Behavior }
export { generateBehavior }