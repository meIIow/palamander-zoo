import { Coordinate } from '../common/circle.ts'
import { SampleBehavior, getSampleBehavior } from './sample-behavior.ts';
import { generateGetSample, generateSampler } from './movement-sample.ts'

type MovementBehavior = {
  speedCap: number; // (Pal Units) / Second
  turnCap: number;  // (Angle* Delta) / Second
  maxAccel: number; // (Speed% Delta) / Second
  maxDecel: number; // (Speed% Delta) / Second
}

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
  #behavior: MovementBehavior;
  #supress: SuppressMove;
  #getSpeedPercent: (interval: number)=>number;
  #getTurnPercent: (interval: number)=>number;
  #movement: Movement = {
    angle: 0,
    dist: 0,
    turn: 0,
    speed: 0,
    delta: { x: 0, y: 0 }
  };

  constructor(movementBehavior: MovementBehavior, sampleBehavior: SampleBehavior, supress: SuppressMove) {
    this.#behavior = movementBehavior;
    this.#supress = supress;

    // Generate Sampling Methods.
    const sampleInterval = generateSampler(sampleBehavior.interval);
    this.#getSpeedPercent = generateGetSample(generateSampler(sampleBehavior.speed), sampleInterval);
    this.#getTurnPercent = generateGetSample(generateSampler(sampleBehavior.turn), sampleInterval);
  }

  private static calculateDelta(angle: number, dist: number): Coordinate {
    return {
      x: -Math.sin(angle * Math.PI / 180) * dist,
      y: -Math.cos(angle * Math.PI / 180) * dist,
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
  const movement = {
    speedCap: 2500,
    turnCap: 720,
    maxAccel: 1000,
    maxDecel: 2000,
  }

  const sample = getSampleBehavior(
    { id: '', magnitude: 0 },
    { id: '', magnitude: 0 },
    { id: '', magnitude: 0 });

  return new MovementAgent(movement, sample, supress);
}

export { MovementAgent, getPlaceholderMovementAgent };
export type { Movement, SuppressMove }