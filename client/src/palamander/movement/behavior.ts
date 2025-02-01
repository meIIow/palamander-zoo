import { mapSpeedBehavior } from './speed-behavior.ts';
import { mapRotationBehavior } from './rotation-behavior.ts';

type MovementBehavior = {
  linear: string,
  rotational: string,
};

function processBehavior(behavior: MovementBehavior) {
  return {
    linear: mapSpeedBehavior(behavior.linear),
    rotational: mapRotationBehavior(behavior.rotational),
  }
}

export type { MovementBehavior }
export { processBehavior }