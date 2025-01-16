import { createEngineCircle } from './common/circle.ts'
import { Coords, shiftNegative, shift, toAngleVector } from './common/coords.ts'
import { Segment, hydrateSegment, updateSegment, getBodySegments } from './morphology/segment.ts'
import { MovementAgent, MovementOverride } from './movement/movement-agent.ts'

type Palamander = {
  body: Segment[];
  pivotIndex: number;
  updateInterval: number;
  movementAgent: MovementAgent;
  override: Override,
  magnificaiton: number;
};

type PalamanderState = {
  head: Segment;
  delta: Coords;
  pivot: Coords;
}

type Override = {
  freeze: boolean,
  move: MovementOverride,
}

type AnimationFunc = (update: (state: PalamanderState) => PalamanderState) => void;

const startUpdateLoop = (pal: Palamander, animate: AnimationFunc): () => void => {
  if (pal.override.freeze) return () => {};
  const locked = { ...pal }; // safe from changes to top-level pal values
  const updateCircle = createEngineCircle(pal.body[0].circle);
  let prevTime = Date.now();
  const intervalId = setInterval(() => {
    const currTime = Date.now();
    const interval = currTime-prevTime;
    const movement = locked.movementAgent.move(interval, locked.override.move);
    animate((state: PalamanderState) => {
      const head = updateSegment(state.head, updateCircle, movement.angle, movement.angle, interval, movement.speed);
      const body = getBodySegments(head)
      const center = calculateFractionalCoordinates(body, locked.pivotIndex);
      const pivot = calculateTangent(center, head.circle.center, -body[Math.floor(locked.pivotIndex)].bodyAngle.absolute);
      const pivotDelta = shiftNegative(state.pivot, pivot);
      const delta = shift(shift(state.delta, movement.delta), pivotDelta);
      return {
        head,
        delta,
        pivot,
      };
    });
    prevTime = currTime;
  }, locked.updateInterval);
  return () => clearInterval(intervalId);
};

function initializePalamanderState(pal: Palamander): PalamanderState {
  const initialAngle = pal.override.move.angle ?? 0;
  const head = pal.body[0];
  return {
    head: hydrateSegment(head, createEngineCircle(head.circle), initialAngle, Date.now()),
    delta: { x: 0, y: 0 },
    pivot: calculateFractionalCoordinates(getBodySegments(head), pal.pivotIndex),
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

export { startUpdateLoop, initializePalamanderState, calculatePivotIndex, getBodySegments, calculateFractionalCoordinates }; 
export type { Palamander, PalamanderState };