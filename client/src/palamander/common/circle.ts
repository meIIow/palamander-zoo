type Circle = {
  radius: number;
  center: Coordinate;
};

type Coordinate = {
  x: number;
  y: number;
};

function createOrigin(): Coordinate {
  return { x: 0, y: 0 }
}

function createSpawnMult(): Coordinate {
  return { x: Math.random(), y: Math.random() };
}

function createDefaultCircle(radius: number): Circle {
  return {
    radius,
    center: createOrigin()
  }
}

// Creates a circle corresponding to a phantom Engine Segment that leads a Pal's head.
// Feed in movement updates to this circle in order to update the Pal appropriately.
function createEngineCircle(head: Circle, origin: Coordinate = createOrigin()): Circle {
  return {
    radius: -1 * head.radius,
    center: origin,
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

function shift(coordinates: Coordinate, delta: Coordinate) {
  return {
    x: coordinates.x + delta.x,
    y: coordinates.y + delta.y,
  };
}

function calculateDelta(a: Coordinate, b: Coordinate) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function toAngleVector(angle: number): Coordinate {
  const radians = angle * Math.PI / 180;
  return {
    x: -Math.sin(radians),
    y: -Math.cos(radians),
  }
}

function toVector(dist: number, angle: number) {
  const angleVector = toAngleVector(angle);
  return {
    x: dist * angleVector.x,
    y: dist * angleVector.y,
  };
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
export { createOrigin, createSpawnMult, createDefaultCircle, createEngineCircle, generateUpdateCircle, calculateCenter, calculateDelta, toAngleVector, toVector, shift }
