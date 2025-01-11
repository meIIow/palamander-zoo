import { Circle, Coordinate, stretchCircle, shift, stretch, calculateDelta, round } from './common/circle.ts'

interface PalamanderRange {
  sync: () => void;
  magnify: (radius: number) => number;
  calculateBottomRightEdges: (circle: Circle) => Coordinate[];
}

interface Range {
  range: Coordinate;
  upperLeft: Coordinate;
  lowerRight: Coordinate;
}

function wrapToRange(coordinate: number, range: number): number {
  // console.log('wrapping...');
  if (coordinate < range) coordinate += Math.ceil((range - coordinate) / range) * range;
  return coordinate % range;
}

function wrapAround(coord: Coordinate, range: Range): Coordinate {
  return {
    x: range.upperLeft.x + wrapToRange(coord.x, range.range.x),
    y: range.upperLeft.y + wrapToRange(coord.y, range.range.y),
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

  calculateBottomRightEdges(circle: Circle): Coordinate[] {
    const pixelCircle = stretchCircle(circle, this.#magnification/100);
    pixelCircle.center = shift(pixelCircle.center, this.#spawn);

    // Shift to edge location, wrap the edge, then unshift back to center.
    const wrappedCenters = [ -1, 1 ].map((xDir) => [ -1, 1].map((yDir) => {
      const edgeOffset = { x: pixelCircle.radius * xDir, y: pixelCircle.radius * yDir };
      const edge = shift(pixelCircle.center, edgeOffset)
      const wrappedEdge = wrapAround(edge, this.#range);
      return round(calculateDelta(wrappedEdge, edgeOffset));
    })).flat();

    // Keep only unique centers.
    const centerMap = wrappedCenters.reduce((acc: { [key: string]: Coordinate }, center) => {
      acc[JSON.stringify(center)] = center;
      return acc
    }, {});
    const uniquewrappedCenters = Object.entries(centerMap).map(([ _, edge ]) => edge);

    // Return bottom right edge
    const lowerRightOffset = stretch({ x: pixelCircle.radius, y: pixelCircle.radius }, -1);
    return uniquewrappedCenters.map((center) => shift(center, lowerRightOffset));
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