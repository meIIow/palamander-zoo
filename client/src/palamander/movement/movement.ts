import { Coords } from '../common/coords.ts'
import { BehaviorInput, generateBehavior } from './behavior.ts';
import { VelocityIntegral, VelocityOverride, generateSampleVelocity } from './velocity.ts'

type Movement = {
  linear: VelocityIntegral,
  rotational: VelocityIntegral,
  delta: Coords,
}

// To specify multiplicative transformations over normal movement behavior.
type MovementFactor = {
  linear: number,
  rotational: number,
  interval: number,
}

// To short-circuit movement calculations and specify static values.
type MovementOverride = {
  linear: VelocityOverride,
  rotational: VelocityOverride,
  angle?: number,
}

type Move = (interval: number, factor: MovementFactor, override: MovementOverride) => Movement;

function compoundAngle(angle: number, turn: number, speed: number): number {
  const speedFactor = (1 - speed / 100); // cannot turn as well at speed.
  return angle + turn * speedFactor;
}

function calculateDelta(angle: number, dist: number): Coords {
  return {
    x: -Math.sin(angle * Math.PI / 180) * dist,
    y: -Math.cos(angle * Math.PI / 180) * dist,
  }
}

function generateMove(behavior: BehaviorInput): Move {
  const movementBehavior = generateBehavior(behavior);
  const sampleLinear = generateSampleVelocity(movementBehavior.speed);
  const sampleRotational = generateSampleVelocity(movementBehavior.rotation);

  let angle = 0; // tracks current orientation
  return (interval: number, factor: MovementFactor, override: MovementOverride): Movement => {
    interval *= factor.interval;
    const linear = sampleLinear(interval, factor.linear, override.linear);
    const rotational = sampleRotational(interval, factor.rotational, override.rotational);

    // Tack angle turned onto previous direction to get compound angle of current direction.
    angle = override.angle ?? compoundAngle(angle, rotational.distance, linear.velocity);
    rotational.distance = angle;

    // Complete movement by calculating coordinate offset from previous state.
    const delta = calculateDelta(angle, linear.distance);
    return {
      linear,
      rotational,
      delta,
    }
  };
}

export type { Move, Movement, MovementFactor, MovementOverride }
export { generateMove }