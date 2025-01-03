import { Circle, Coordinate } from './common/circle.ts'

interface PalamanderRange {
  sync: () => void;
  magnify: (radius: number) => number;
  wrapToRange: (circle: Circle) => Coordinate;
}

interface Range {
  range: Coordinate;
  upperLeft: Coordinate;
  lowerRight: Coordinate;
}

function calculatePixelCoords(center: Coordinate, radius: number, magnification: number) {
  return {
    x: (center.x - radius) * magnification/100,
    y: (center.y - radius) * magnification/100
  };
}

function wrapAround(coord: Coordinate, range: Range): Coordinate {
  return {
    x: range.upperLeft.x + ((coord.x + range.range.x) % range.range.x),
    y: range.upperLeft.y + ((coord.y + range.range.y) % range.range.y)
  };
}

class IndexedWindowRange implements PalamanderRange {
  #count: number;
  #row: number;
  #col: number;
  #magnification: number;
  #spawn: Coordinate;
  #range: Range;

  constructor(count: number, row: number, col: number, mag: number, spawnMult: Coordinate) {
    this.#count = count;
    this.#row = row;
    this.#col = col;
    this.#magnification = mag;
    this.#range = IndexedWindowRange.calculateRange(count, row, col);
    this.#spawn = {
      x: this.#range.range.x * spawnMult.x + this.#range.upperLeft.x,
      y: this.#range.range.y * spawnMult.y + this.#range.upperLeft.y,
    };
  }

  sync() {
    this.#range = IndexedWindowRange.calculateRange(this.#count, this.#row, this.#col);
  }

  magnify(radius: number) {
    return 2 * radius * this.#magnification/100;
  }

  wrapToRange(circle: Circle): Coordinate {
    const unwrappedCoords = calculatePixelCoords(circle.center, circle.radius, this.#magnification);
    unwrappedCoords.x += this.#spawn.x;
    unwrappedCoords.y += this.#spawn.y;
    return wrapAround(unwrappedCoords, this.#range);
  }

  private static calculateRange(count: number, row: number, col: number): Range {
    const range = { x: window.innerWidth / count, y: window.innerHeight / count};
    const upperLeft = {
      x: range.x * col,
      y: range.y * row,
    };
    const lowerRight = {
      x: range.x + upperLeft.x,
      y: range.y + upperLeft.y,
    };
    return { range, upperLeft, lowerRight };
  }
}

export type { PalamanderRange };
export { IndexedWindowRange };