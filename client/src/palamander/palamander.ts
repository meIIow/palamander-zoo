import { createEngineCircle } from './common/circle.ts'
import { Coords, shiftNegative, shift, toAngleVector } from './common/coords.ts'
import { Segment, updateSegment, getBodySegments } from './morphology/segment.ts'
import { MovementAgent } from './movement/movement-agent.ts'
import { PalamanderRange } from './palamander-range.ts'

type Palamander = {
  body: Segment[];
  pivotIndex: number;
  updateInterval: number;
  movementAgent: MovementAgent;
  range: PalamanderRange;
};

type PalamanderState = {
  head: Segment;
  delta: Coords;
  pivot: Coords;
}

type AnimationFunc = (update: (state: PalamanderState) => PalamanderState) => void;

const initializeUpdateLoop = (pal: Palamander, animate: AnimationFunc ): NodeJS.Timeout => {
  const movementAgent = pal.movementAgent;
  const pivotIndex = pal.pivotIndex;
  const updateCircle = createEngineCircle(pal.body[0].circle);
  let prevTime = Date.now();
  return setInterval(() => {
    const currTime = Date.now();
    const interval = currTime-prevTime;
    const movement = movementAgent.move(interval);
    animate((state: PalamanderState) => {
      const head = updateSegment(state.head, updateCircle, movement.angle, movement.angle, interval, movement.speed);
      const body = getBodySegments(head)
      const center = calculateFractionalCoordinates(body, pivotIndex);
      const pivot = calculateTangent(center, head.circle.center, -body[Math.floor(pivotIndex)].bodyAngle.absolute);
      const pivotDelta = shiftNegative(state.pivot, pivot);
      const delta = shift(shift(state.delta, movement.delta), pivotDelta);
      return {
        head,
        delta,
        pivot,
      };
    });
    prevTime = currTime;
  }, pal.updateInterval);
};

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

function calculateFractionalCoordinates(body: Segment[], index: number): Coords {
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

function calculateTangent(a: Coords, b: Coords, angle: number): Coords {
  const aPrime = changeBasis(a, angle);
  const bPrime = changeBasis(b, angle);
  const cPrime = {
    x: bPrime.x,
    y: aPrime.y
  };
  return changeBasis(cPrime, -angle);
}

function changeBasis(coordinate: Coords, angle: number) {
  const radiants = angle * Math.PI / 180;
  return {
    x: coordinate.x * Math.cos(radiants) + coordinate.y * Math.sin(radiants),
    y: -coordinate.x * Math.sin(radiants) + coordinate.y * Math.cos(radiants)
  }
}

export { initializeUpdateLoop, calculatePivotIndex, getBodySegments, calculateFractionalCoordinates }; 
export type { Palamander, PalamanderState };