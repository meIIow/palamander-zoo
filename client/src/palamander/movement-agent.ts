import { Coordinate } from './segment.ts'

type Movement = {
  speed: number,
  angle: number,
  direction: number,
  delta: Coordinate,
}

class MovementAgent {
  // Class properties
  #turnLikelihood: number;
  #turnAngle: number;
  #movement: Movement = {
    angle: 0,
    speed: 0,
    direction: 0,
    delta: { x: 0, y: 0 }
  };

  // Constructor
  constructor(turnLikelihood: number, turnAngle: number) {
    this.#turnLikelihood = turnLikelihood;
    this.#turnAngle = turnAngle;
  }

  // Simplified turning with 3 states - turning right, turning left, going straight
  private updateDirection(direction: number): number {
    const leftTurnCutoff = this.#turnLikelihood / 2 / 100;
    const rightTurnCutoff = 1 - this.#turnLikelihood / 2 / 100;
    const rand = Math.random();
    if (rand < leftTurnCutoff) {
      return Math.min(direction-1, -1);
    }
    if (rand > rightTurnCutoff) {
      return Math.max(direction+1, 1);
    }
    return direction;
  }

  // Reasonably natural-looking, hard-coded (for now) speed algorithm
  private static updateSpeed(speed: number): number {
    const rand = Math.random();
    if (rand > 0.9) {
      // keep same speed 90% of the time
      if (rand > 0.98) {
        // stop suddenly
        speed = 4
      }
      else if (rand > 0.96) {
        // slow
        speed = speed / 2
      }
      else if (rand > 0.94) {
        speed += 4
      }
      else if (rand > 0.92) {
        speed += 8
      }
      else {
        speed += 0
      }
    }
    return speed;
  }

  private static updateDelta(delta: Coordinate, angle: number, speed: number): Coordinate {
    return {
      x: delta.x - Math.sin(angle * Math.PI / 180) * speed,
      y: delta.y - Math.cos(angle * Math.PI / 180) * speed,
    }
  }

  move(): Movement {
    const direction = this.updateDirection(this.#movement.direction);
    const speed = MovementAgent.updateSpeed(this.#movement.speed);
    const angle = this.#movement.angle + direction * this.#turnAngle;
    const delta = MovementAgent.updateDelta(this.#movement.delta, angle, speed);
    this.#movement = {
      angle,
      speed,
      direction,
      delta,
    }
    return this.#movement;
  }
}

export default MovementAgent;
export type { Movement }