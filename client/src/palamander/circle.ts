type Circle = {
  radius: number;
  center: Coordinate;
};

type Coordinate = {
  x: number;
  y: number;
};

function createDefaultCircle(radius: number): Circle {
  return {
    radius,
    center: {
      x: 0,
      y: 0,
    },
  }
}

// Creates a circle corresponding to a phantom Engine Segment that leads a Pal's head.
// Feed in movement updates to this circle in order to update the Pal appropriately.
function createEngineCircle(head: Circle, spawn: Coordinate): Circle {
  return {
    radius: -1 * head.radius,
    center: spawn,
  }
}

// Generate function to return updated Circle from original Circle plus offset coords.
function generateUpdateCircle(circle: Circle) {
  return (delta: Coordinate) => {
    return {
      radius: circle.radius,
      center: {
        x: circle.center.x + delta.x,
        y: circle.center.y + delta.y,
      }
    }
  }
}

// Calculates center of circle if "tangent" (but w/ given overlap) to rootCircle at given angle.
function calculateCenter(
    circle: Circle,
    rootCircle: Circle,
    overlap: number,
    angle: number): Coordinate {
  const xd = Math.sin(angle * Math.PI / 180) * (circle.radius + rootCircle.radius - overlap);
  const yd = Math.cos(angle * Math.PI / 180) * (circle.radius + rootCircle.radius - overlap);
  return {
    x: rootCircle.center.x+xd,
    y: rootCircle.center.y+yd
  }
}

export type { Circle, Coordinate };
export { createDefaultCircle, createEngineCircle, generateUpdateCircle, calculateCenter }
