type Coords = {
  x: number;
  y: number;
}

function createOrigin(): Coords {
  return { x: 0, y: 0 }
}

function createSpawnFactor(): Coords {
  return { x: Math.random(), y: Math.random() };
}

function shift(coord: Coords, delta: Coords) {
  return {
    x: coord.x + delta.x,
    y: coord.y + delta.y,
  };
}

function shiftNegative(coord: Coords, delta: Coords) {
  return shift(coord, stretch(delta, -1));
}

function stretch(coordinates: Coords, factor: number) {
  return {
    x: coordinates.x * factor,
    y: coordinates.y * factor,
  };
}

function stretchByElement(coordinates: Coords, factor: Coords) {
  return {
    x: coordinates.x * factor.x,
    y: coordinates.y * factor.y,
  };
}

// Rounds 3 decimal places.
function round(coordinates: Coords) {
  return {
    x: Math.round(coordinates.x * 1000) / 1000,
    y: Math.round(coordinates.y * 1000) / 1000,
  };
}

function toAngleVector(angle: number): Coords {
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

export type { Coords };
export { createOrigin, createSpawnFactor, shift, shiftNegative, stretch, stretchByElement, round, toAngleVector, toVector }
