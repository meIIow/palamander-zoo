import { Circle, stretchCircle } from './common/circle.ts'
import { Coords, createOrigin, shift, stretch, shiftNegative, round, stretchByElement } from './common/coords.ts'

type Range = {
  range: Coords;
  upperLeft: Coords;
  lowerRight: Coords;
}

type DisplayRangeOptions = {
  calculateRange: RangeCalculator;
  fixed: boolean,
}

type RangeCalculator = (rect: DOMRect) => Range;

const getRangeFromWindow: RangeCalculator = (_: DOMRect ) => {
  const range = { x: window.innerWidth, y: window.innerHeight };
  const upperLeft = createOrigin();
  const lowerRight = { ...range };
  return { range, upperLeft, lowerRight };
}

const getRangeFromParent: RangeCalculator = (rect: DOMRect ) => {
  const range = { x: rect.width, y: rect.height };
  const upperLeft = createOrigin();
  const lowerRight = { ...range };
  return { range, upperLeft, lowerRight };
}

function wrapToRange(coordinate: number, range: number): number {
  if (coordinate < range) coordinate += Math.ceil((range - coordinate) / range) * range;
  return coordinate % range;
}

function wrapAround(coord: Coords, range: Range): Coords {
  return {
    x: range.upperLeft.x + wrapToRange(coord.x, range.range.x),
    y: range.upperLeft.y + wrapToRange(coord.y, range.range.y),
  };
}

function magnify(radius: number, magnification: number) {
  return 2 * radius * (magnification / 100);
}

function calculateBottomRightEdges(circle: Circle, range: Range, spawn: Coords, magnification: number): Coords[] {
  const pixelCircle = stretchCircle(circle, magnification/100);
  pixelCircle.center = shift(pixelCircle.center, spawn);

  // Shift to edge location, wrap the edge, then unshift back to center.
  const wrappedCenters = [ -1, 1 ].map((xDir) => [ -1, 1].map((yDir) => {
    const edgeOffset = { x: pixelCircle.radius * xDir, y: pixelCircle.radius * yDir };
    const edge = shift(pixelCircle.center, edgeOffset)
    const wrappedEdge = wrapAround(edge, range);
    return round(shiftNegative(wrappedEdge, edgeOffset));
  })).flat();

  // Keep only unique centers.
  const centerMap = wrappedCenters.reduce((acc: { [key: string]: Coords }, center) => {
    acc[JSON.stringify(center)] = center;
    return acc
  }, {});
  const uniquewrappedCenters = Object.entries(centerMap).map(([ _, edge ]) => edge);

  // Return bottom right edge
  const lowerRightOffset = stretch({ x: pixelCircle.radius, y: pixelCircle.radius }, -1);
  return uniquewrappedCenters.map((center) => shift(center, lowerRightOffset));
}

class DisplayRange {
  #spawnFactor: Coords;
  #options: DisplayRangeOptions;
  #spawn: Coords | undefined;
  #range: Range | undefined;

  constructor(options: DisplayRangeOptions, spawnFactor: Coords) {
    this.#spawnFactor = spawnFactor;
    this.#options = options;
  }

  setRange(rect: DOMRect) {
    this.#range = this.#options.calculateRange(rect);
    this.#spawn = shift(this.#range.upperLeft, stretchByElement(this.#range.range, this.#spawnFactor));
    return this;
  }

  styleSegment(circle: Circle, magnification: number): React.CSSProperties[] {
    if (this.#range == undefined) return [];
    if (this.#spawn == undefined) return [];
    const bottomRightEdges = calculateBottomRightEdges(circle, this.#range, this.#spawn, magnification);
    const size = magnify(circle.radius, magnification);
    return bottomRightEdges.map(({ x, y }) => {
      return {
        bottom: `${y}px`,
        right: `${x}px`,
        height: `${size}px`,
        width: `${size}px`,
        backgroundColor: 'teal',
        position: this.#options.fixed ? 'fixed' : 'absolute',
        borderRadius: '50%',
      };
    });
  }
}

function generateWindowDisplayRange(spawnFactor: Coords): DisplayRange {
  const options: DisplayRangeOptions = {
    calculateRange: getRangeFromWindow,
    fixed: true,
  }
  return new DisplayRange(options, spawnFactor);
}

function generateBoundedDisplayRange(spawnFactor: Coords): DisplayRange {
  const options: DisplayRangeOptions = {
    calculateRange: getRangeFromParent,
    fixed: false,
  }
  return new DisplayRange(options, spawnFactor);
}

export type { RangeCalculator };
export { DisplayRange, generateWindowDisplayRange, generateBoundedDisplayRange };