import { Coords, createOrigin, shift, stretch } from './coords.ts';

type Circle = {
  radius: number;
  center: Coords;
};

function createDefaultCircle(radius: number): Circle {
  return {
    radius,
    center: createOrigin()
  }
}

// Creates a circle corresponding to a phantom Engine Segment that leads a Pal's head.
// Feed in movement updates to this circle in order to update the Pal appropriately.
function createEngineCircle(head: Circle, origin: Coords = createOrigin()): Circle {
  return {
    radius: -1 * head.radius,
    center: origin,
  }
}

// Generate function to return updated Circle from original Circle plus offset coords.
function generateUpdateCircle(circle: Circle) {
  return (delta: Coords) => {
    return {
      radius: circle.radius,
      center: shift(circle.center, delta),
    }
  }
}

function stretchCircle(circle: Circle, factor: number) {
  return {
    center: stretch(circle.center, factor),
    radius: circle.radius * factor,
  }
}

// Calculates center of circle if "tangent" (but w/ given overlap) to rootCircle at given angle.
function calculateCenter(
    circle: Circle,
    rootCircle: Circle,
    overlap: number,
    angle: number): Coords {
  const xd = Math.sin(angle * Math.PI / 180) * (circle.radius + rootCircle.radius - overlap);
  const yd = Math.cos(angle * Math.PI / 180) * (circle.radius + rootCircle.radius - overlap);
  return {
    x: rootCircle.center.x+xd,
    y: rootCircle.center.y+yd
  }
}

export type { Circle };
export { createDefaultCircle, createEngineCircle, generateUpdateCircle, calculateCenter, stretchCircle }
