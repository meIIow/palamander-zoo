import { Coordinate } from './segment.ts'
import { SampleSpec, generateGetSample, generateSampler } from './movement-sample.ts'

// In 'Pal Units' / Second
type MovementBehavior = {
  maxSpeed: number;
  maxAccel: number;
  maxDecel: number;
}

type SampleBehavior = {
  speed: SampleSpec;
  turn: SampleSpec;
  interval: {
    skewMin: number;
    min: number;
    max: number;
  }
}

type Movement = {
  speed: number;
  angle: number;
  speedPercent: number,
  turnPercent: number,
  delta: Coordinate,
}

class MovementAgent {
  #behavior: MovementBehavior
  #getSpeedPercent: (interval: number)=>number;
  #getTurnPercent: (interval: number)=>number;
  #movement: Movement = {
    angle: 0,
    speed: 0,
    turnPercent: 0,
    speedPercent: 0,
    delta: { x: 0, y: 0 }
  };

  constructor(movementBehavior: MovementBehavior, sampleBehavior: SampleBehavior) {
    this.#behavior = movementBehavior;

    // Generate Sampling Methods.
    const sampleInterval = generateSampler(
      sampleBehavior.interval.min,
      sampleBehavior.interval.max,
      {
        zero: 0,
        skewMin: sampleBehavior.interval.skewMin,
        mirror: false
      });
    this.#getSpeedPercent = generateGetSample(generateSampler(0, 100, sampleBehavior.speed), sampleInterval);
    this.#getTurnPercent = generateGetSample(generateSampler(0, 100, sampleBehavior.turn), sampleInterval);
  }

  private static updateDelta(delta: Coordinate, angle: number, speed: number): Coordinate {
    return {
      x: delta.x - Math.sin(angle * Math.PI / 180) * speed,
      y: delta.y - Math.cos(angle * Math.PI / 180) * speed,
    }
  }

  private calculateSpeed(speedPercent: number): number {
    const speed = this.#behavior.maxSpeed * speedPercent / 100;
    // Clip speed if delta is too large.
    // PLACEHOLDER - ultimately accel/decel limits should depend on update interval.
    if (this.#movement.speed - speed > this.#behavior.maxDecel) {
      return this.#movement.speed-this.#behavior.maxDecel;
    }
    if (speed - this.#movement.speed > this.#behavior.maxAccel) {
      return this.#movement.speed+this.#behavior.maxAccel;
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

function getPlaceholderMovementAgent() {
  const movement = {
    maxSpeed: 50,
    maxAccel: 2,
    maxDecel: 4,
  }

  const sample = {
    speed: {
      zero: 0.15,
      skewMin: 3,
      mirror: false,
    },
    turn: {
      zero: 0.15,
      skewMin: 2,
      mirror: true,
    },
    interval: {
      skewMin: 3,
      min: 200, // ms
      max: 5000, //ms
    }
  }

  return new MovementAgent(movement, sample);
}

export default getPlaceholderMovementAgent;
export type { Movement }