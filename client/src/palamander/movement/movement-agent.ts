import { Coordinate } from '../common/circle.ts'
import { Behavior, generateBehavior } from './behavior.ts';

type Movement = {
  dist: number;
  angle: number;
  speed: number,
  turn: number,
  delta: Coordinate,
}

type SuppressMove = {
  turn: boolean;
  speed: boolean;
}

class MovementAgent {
  #behavior: Behavior;
  #supress: SuppressMove;
  #movement: Movement = {
    angle: 0,
    dist: 0,
    turn: 0,
    speed: 0,
    delta: { x: 0, y: 0 }
  };

  constructor(behavior: Behavior, supress: SuppressMove) {
    this.#behavior = behavior;
    this.#supress = supress;
  }

  private static calculateDelta(angle: number, dist: number): Coordinate {
    return {
      x: -Math.sin(angle * Math.PI / 180) * dist,
      y: -Math.cos(angle * Math.PI / 180) * dist,
    }
  }

  private clipSpeed(interval: number, speed: number): number {
    const maxDecel = this.#behavior.speed.limit.decel * (interval / 1000);
    const maxAccel = this.#behavior.speed.limit.accel * (interval / 1000);

    // Clip speed if (acc/dec)eleration are outside max range for this interval.
    if (this.#movement.speed - speed > maxDecel) {
      return this.#movement.speed-maxDecel;
    }
    if (speed - this.#movement.speed > maxAccel) {
      return this.#movement.speed+maxAccel;
    }
    return speed;
  }

  private calculateDist(interval: number, speed: number): number {
    return (speed / 100) * (interval / 1000) * this.#behavior.speed.limit.velocity;
  }

  private calculateAngle(interval: number, turn: number, speed: number): number {
    const turnAngle = (interval / 1000) * this.#behavior.rotation.limit.velocity * (turn / 100);
    // Cannot turn as well at speed.
    return this.#movement.angle + turnAngle * (1 - speed / 100);
  }

  move(interval: number): Movement {
    const speed = this.clipSpeed(interval, this.#behavior.speed.sampler(interval));
    const turn = this.#behavior.rotation.sampler(interval);
    const dist = this.#supress.speed ? 0 : this.calculateDist(interval, speed);

    const angle = this.#supress.turn ? 0 : this.calculateAngle(interval, turn, speed);
    const delta = MovementAgent.calculateDelta(angle, dist);

    this.#movement = {
      angle,
      dist,
      speed,
      turn,
      delta,
    }
    return this.#movement;
  }
}

function getPlaceholderMovementAgent(supress: SuppressMove = { turn: false, speed: false }) {
  const behavior = generateBehavior(
    { id: '', velocity: 0, interval: 0 },
    { id: '', velocity: 0, interval: 0 });

  return new MovementAgent(behavior, supress);
}

export { MovementAgent, getPlaceholderMovementAgent };
export type { Movement, SuppressMove }