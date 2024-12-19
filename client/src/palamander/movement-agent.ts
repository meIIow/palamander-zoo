import { Coordinate } from './segment.ts'
import { generateGetSample, generateSampleSpeed, generateSampleAngle, generateSampleInterval } from './movement-sample.ts'

type Movement = {
  speed: number;
  angle: number;
  speedPercent: number,
  turnPercent: number,
  delta: Coordinate,
}

class MovementAgent {
  #maxSpeed: number;
  #maxAccel: number;
  #maxDecel: number;
  #getSpeedPercent: (interval: number)=>number;
  #getTurnPercent: (interval: number)=>number;
  #movement: Movement = {
    angle: 0,
    speed: 0,
    turnPercent: 0,
    speedPercent: 0,
    delta: { x: 0, y: 0 }
  };

  constructor(maxSpeed: number) {
    this.#maxSpeed = maxSpeed;
    this.#maxAccel = 2; // hard-coded placeholder
    this.#maxDecel = 4; // hard-coded placeholder
    // Hard-coded placeholders.
    this.#getSpeedPercent = generateGetSample(generateSampleSpeed(0, 100, 0.15, 3), generateSampleInterval(200, 5000, 3));
    this.#getTurnPercent = generateGetSample(generateSampleAngle(0, 100, 0.15, 2), generateSampleInterval(200, 5000, 3));
  }

  private static updateDelta(delta: Coordinate, angle: number, speed: number): Coordinate {
    return {
      x: delta.x - Math.sin(angle * Math.PI / 180) * speed,
      y: delta.y - Math.cos(angle * Math.PI / 180) * speed,
    }
  }

  private calculateSpeed(speedPercent: number): number {
    const speed = this.#maxSpeed * speedPercent / 100;
    // Clip speed if delta is too large.
    // PLACEHOLDER - ultimately accel/decel limits should depend on update interval.
    if (this.#movement.speed - speed > this.#maxDecel) {
      return this.#movement.speed-this.#maxDecel;
    }
    if (speed - this.#movement.speed > this.#maxAccel) {
      return this.#movement.speed+this.#maxAccel;
    }
    return speed;
  }

  move(interval: number): Movement {
    const speedPercent = this.#getSpeedPercent(interval);
    const turnPercent = this.#getTurnPercent(interval);
    const speed = this.calculateSpeed(speedPercent);

    // PLACEHOLDER - ultimately angle should depend on speed
    const angle = this.#movement.angle + turnPercent / 2;
    const delta = MovementAgent.updateDelta(this.#movement.delta, angle, speed);

    this.#movement = {
      angle,
      speed,
      speedPercent,
      turnPercent,
      delta,
    }
    return this.#movement;
  }
}

export default MovementAgent;
export type { Movement }