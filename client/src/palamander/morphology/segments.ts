import { Segment, createSegment } from './segment.ts';
import { WriggleSpec, generateCompositeWriggle, generateSquiggleSpec, generateRotationSpec, generatePullInAtSpeed } from './wriggle.ts';

// Config for a series of segments.
export type SegmentsSpec = {
  count: number;
  radius: number;
  taperFactor: number;
  angle: number;
  overlapMult: number;
  curveRange: number;
  offset: number;
}

// Creates a series of segments with gradually increasing squiggle magnitude, supressed at speed.
export function createSquiggleGradient(
    parent: Segment,
    spec: SegmentsSpec,
    period: number,
    startRange: number,
    endRange: number,
    supressionFactor: number): Segment[] {
  const getFractionI = (i: number) => (spec.count - i - 1) / (spec.count-1);
  const generateSupressWiggleAtSpeed = (i: number) => {
    const supression = supressionFactor * getFractionI(i);
    return (angle: number, speed: number): number => {
      return angle * (1 - speed / 100 * supression);
    };
  };
  const generateWiggleSpec = (i: number) => {
    const squiggleRange = endRange - getFractionI(i) * (endRange-startRange);
    const squiggleSpec = generateSquiggleSpec(squiggleRange, period, i, spec.count*2);
    squiggleSpec.speedTransformation = generateSupressWiggleAtSpeed(i);
    return [squiggleSpec]
  };
  return createDefault(parent, spec, generateWiggleSpec);
}

// Creates a squiggly limb that pulls inward at high speed.
export function createSimpleLimb(
    parent: Segment,
    spec: SegmentsSpec,
    range: number,
    pullTowards: number,
    period: number): Segment[] {
  const generateWiggleSpec = (i: number) => {
    const wiggleSpec = generateSquiggleSpec(range, period, i, spec.count*2);
    wiggleSpec.speedTransformation = generatePullInAtSpeed(pullTowards, spec.angle);
    return [wiggleSpec];
  }
  return createDefault(parent, spec, generateWiggleSpec);
}

// Creates a straight line of segments that rotate together.
export function createRotation(
    parent: Segment,
    spec: SegmentsSpec,
    angle: number,
    period: number): Segment[] {
  const generateWriggleSpec = (_: number) => [generateRotationSpec(angle, period, spec.offset)];
  return createDefault(parent, spec, generateWriggleSpec);
}

// Creates a default series of segments, one after another, from segments spec and wriggle specs.
export function createDefault(
    parent: Segment,
    spec: SegmentsSpec,
    generateWriggleSpec: (i: number) => WriggleSpec[] = (_: number) => [] ): Segment[] {
  const segments = [];
  let curr = parent;
  let radius = spec.radius;
  for (let i=0; i < spec.count; i++) {
    radius = radius * spec.taperFactor;
    const next = createSegment(radius, spec.angle, spec.overlapMult);
    next.bodyAngle.curveRange = spec.curveRange;
    next.wriggle = generateCompositeWriggle(generateWriggleSpec(i)),
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

// Curves given segments by a given amount.
export function addCurve(segments: Segment[], curveAngle: number): Segment[] {
  segments.forEach((segment, i) => {
    segment.bodyAngle.relative += i * curveAngle;
  });
  return segments;
}