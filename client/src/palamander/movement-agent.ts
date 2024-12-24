import { Coordinate } from './segment.ts'
import { SampleSpec, generateGetSample, generateSampler } from './movement-sample.ts'

type MovementBehavior = {
  speedCap: number; // (Pal Units) / Second
  turnCap: number;  // (Angle* Delta) / Second
  maxAccel: number; // (Speed% Delta) / Second
  maxDecel: number; // (Speed% Delta) / Second
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
  dist: number;
  angle: number;
  speed: number,
  turn: number,
  delta: Coordinate,
}

class MovementAgent {
  #behavior: MovementBehavior
  #getSpeedPercent: (interval: number)=>number;
  #getTurnPercent: (interval: number)=>number;
  #movement: Movement = {
    angle: 0,
    dist: 0,
    turn: 0,
    speed: 0,
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

  private static updateDelta(delta: Coordinate, angle: number, dist: number): Coordinate {
    return {
      x: delta.x - Math.sin(angle * Math.PI / 180) * dist,
      y: delta.y - Math.cos(angle * Math.PI / 180) * dist,
    }
  }

  private clipSpeed(interval: number, speed: number): number {
    const maxDecel = this.#behavior.maxDecel * (interval / 1000);
    const maxAccel = this.#behavior.maxAccel * (interval / 1000);

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
    return (speed / 100) * (interval / 1000) * this.#behavior.speedCap;
  }

  private calculateAngle(interval: number, turn: number, speed: number): number {
    const turnAngle = (interval / 1000) * this.#behavior.turnCap * (turn / 100);
    // Cannot turn as well at speed.
    return this.#movement.angle + turnAngle * (1 - speed / 100);
  }

  move(interval: number): Movement {
    const speed = this.clipSpeed(interval, this.#getSpeedPercent(interval));
    const turn = this.#getTurnPercent(interval);
    const dist = this.calculateDist(interval, speed);

    const angle = this.calculateAngle(interval, turn, speed);
    const delta = MovementAgent.updateDelta(this.#movement.delta, angle, dist);

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

function getPlaceholderMovementAgent() {
  const movement = {
    speedCap: 2500,
    turnCap: 720,
    maxAccel: 1000,
    maxDecel: 2000,
  }

  const sample = {
    speed: {
      zero: 0.15,
      skewMin: 2,
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