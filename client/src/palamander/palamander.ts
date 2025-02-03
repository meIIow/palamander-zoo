import type { Coords } from './common/coords.ts';
import type { Segment } from './morphology/segment.ts';
import { MovementBehavior } from './movement/behavior.ts';
import type { Move } from './movement/movement.ts';
import { PalModifier } from './palamander-modifier.ts';

import { createEngineCircle } from './common/circle.ts';
import { shiftNegative, shift, toAngleVector } from './common/coords.ts';
import {
  hydrateSegment,
  updateSegment,
  getBodySegments,
} from './morphology/segment.ts';

type Palamander = {
  type: string;
  behavior: MovementBehavior;
  size: number;
  body: Segment[];
  pivotIndex: number;
  mod: PalModifier;
};

type PalamanderState = {
  head: Segment;
  delta: Coords;
  center: Coords;
};

type AnimationFunc = (
  update: (state: PalamanderState) => PalamanderState,
) => void;

// Initiates primary update loop for Palamander movement
const startUpdateLoop = (
  pal: Palamander,
  move: Move,
  animate: AnimationFunc,
): (() => void) => {
  if (pal.mod.override.freeze) return () => {};
  const mod = { ...pal.mod }; // safe from changes to pal.mod fields
  const updateCircle = createEngineCircle(pal.body[0].circle);
  let prevTime = Date.now();
  const intervalId = setInterval(() => {
    const currTime = Date.now();
    const interval = currTime - prevTime;
    const movement = move(interval, mod.factor, mod.override.move);
    animate((state: PalamanderState) => {
      const head = updateSegment(
        state.head,
        updateCircle,
        movement.rotational.distance,
        movement.rotational.distance,
        interval,
        movement.rotational.velocity,
      );
      const center = calculatePivotCoords(head, pal.pivotIndex);
      const centerDelta = shiftNegative(state.center, center);
      const delta = shift(shift(state.delta, movement.delta), centerDelta);
      return {
        head,
        delta,
        center,
      };
    });
    prevTime = currTime;
  }, mod.updateInterval);
  return () => clearInterval(intervalId);
};

function initializePalamanderState(pal: Palamander): PalamanderState {
  const initialAngle = pal.mod.override.move.angle ?? 0;
  const head = hydrateSegment(
    pal.body[0],
    createEngineCircle(pal.body[0].circle),
    initialAngle,
    Date.now(),
  );
  const center = calculatePivotCoords(head, pal.pivotIndex);
  return {
    head,
    delta: shiftNegative({ x: 0, y: 0 }, center),
    center,
  };
}

function calculatePivotIndex(body: Segment[]): number {
  const masses = body.map((segment) => Math.pow(segment.circle.radius, 1.5));
  const mass = masses.reduce((sum: number, mass: number) => sum + mass, 0);
  let massLeft = mass * 0.5;
  for (let i = 0; i < body.length; i++) {
    if (massLeft < masses[i]) {
      const indexFraction = massLeft / masses[i];
      return i + indexFraction;
    }
    massLeft -= masses[i];
  }
  return 0;
}

function calculateFractionalCoordinates(
  body: Segment[],
  index: number,
): Coords {
  const segment = body[Math.floor(index)];
  const angleVector = toAngleVector(segment.bodyAngle.absolute);
  const length = 2 * segment.circle.radius - segment.overlap;
  const centerToEdge = segment.circle.radius - segment.overlap;
  const delta = (index % 1) * length - centerToEdge;
  return {
    x: segment.circle.center.x + delta * angleVector.x,
    y: segment.circle.center.y + delta * angleVector.y,
  };
}

function calculatePivotCoords(head: Segment, index: number): Coords {
  const body = getBodySegments(head);
  const center = calculateFractionalCoordinates(body, index);
  return calculateTangent(
    center,
    head.circle.center,
    -body[Math.floor(index)].bodyAngle.absolute,
  );
}

function calculateTangent(a: Coords, b: Coords, angle: number): Coords {
  const aPrime = changeBasis(a, angle);
  const bPrime = changeBasis(b, angle);
  const cPrime = {
    x: bPrime.x,
    y: aPrime.y,
  };
  return changeBasis(cPrime, -angle);
}

function changeBasis(coordinate: Coords, angle: number) {
  const radiants = (angle * Math.PI) / 180;
  return {
    x: coordinate.x * Math.cos(radiants) + coordinate.y * Math.sin(radiants),
    y: -coordinate.x * Math.sin(radiants) + coordinate.y * Math.cos(radiants),
  };
}

export {
  startUpdateLoop,
  initializePalamanderState,
  calculatePivotIndex,
  getBodySegments,
  calculateFractionalCoordinates,
};
export type { Palamander, PalamanderState };
