import { Segment, createSegment } from '../segment.ts';
import { generateCompositeWriggle } from '../animation/wriggle.ts';
import { WriggleSpec, WaveSpec, createSquiggleSpec, createRotationSpec, generateTuckAtSpeed, generateSquiggleGradientSpec, generateSupressionGradient, injectWriggleSupression } from '../animation/wriggle-spec.ts';

// Config for a series of segments.
export type SegmentsSpec = {
  count: number;
  radius: number;
  taperFactor: number;
  angle: number;
  overlapMult: number;
  curveRange: number;
}

// Creates a series of segments with gradually increasing squiggle magnitude, supressed at speed.
export function createSquiggleGradient(
    parent: Segment,
    spec: SegmentsSpec,
    waveSpec: WaveSpec,
    initialRange: number,
    supressionRange: { front: number, back: number }): Segment[] {
  const suppressionGenerator = generateSupressionGradient(spec.count, supressionRange);
  const squiggleGenerator = generateSquiggleGradientSpec(spec.count, waveSpec, initialRange, 0.2);
  const wriggleGenerator = injectWriggleSupression(squiggleGenerator, suppressionGenerator);
  return createDefault(parent, spec, wriggleGenerator);
}

// Creates a noodly limb that pulls inward at high speed.
export function createNoodleLimb(
    parent: Segment,
    spec: SegmentsSpec,
    waveSpec: WaveSpec,
    pullTowards: number): Segment[] {
  const generateWiggleSpec = (i: number) => {
    const wiggleSpec = createSquiggleSpec(waveSpec, i, spec.count*2);
    wiggleSpec.suppress = generateTuckAtSpeed(spec.angle, pullTowards, 0.5);
    return [wiggleSpec];
  }
  return createDefault(parent, spec, generateWiggleSpec);
}

// Creates a straight line of segments that rotate together.
export function createRotation(
    parent: Segment,
    spec: SegmentsSpec,
    waveSpec: WaveSpec): Segment[] {
  const generateWriggleSpec = (_: number) => [createRotationSpec(waveSpec)];
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

export function calculateTaper(terminationFactor: number, count: number) {
  return Math.pow(terminationFactor, 1/Math.max(1, count));
}

// Curves given segments by a given amount.
export function addCurve(segments: Segment[], curveAngle: number): Segment[] {
  segments.forEach((segment, i) => {
    segment.bodyAngle.relative += i * curveAngle;
  });
  return segments;
}