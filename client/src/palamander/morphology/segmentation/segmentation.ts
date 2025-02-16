import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type {
  WaveSpec,
  WriggleSpecGenerator,
} from '../animation/wriggle-spec.ts';

import clone from 'clone';

import { createSegment } from '../segment.ts';
import { calculateRadius } from '../section.ts';
import { createSuppression, calculateTuck } from '../animation/suppression.ts';
import { toWriggle } from '../animation/wriggle.ts';
import {
  createSquiggleSpec,
  createRotationSpec,
  generateSquiggleGradientSpec,
  generateSupressionGradient,
  injectWriggleSupression,
} from '../animation/wriggle-spec.ts';

// Config for a series of segments.
export type Segmentation = {
  count: number;
  radius: number;
  taperFactor: number;
  angle: number;
  overlapMult: number;
  curveRange: number;
  curve: number;
  wriggle?: WriggleSpecGenerator;
};

// Common preset values for section behavior.
export const preset = {
  period: {
    relaxed: 3.5,
    deliberate: 2.75,
    frenetic: 2,
  },
  curve: {
    squiggly: 20,
    muscley: 10,
  },
};

export function createSegmentation(seg: Partial<Segmentation>): Segmentation {
  return {
    count: 1,
    radius: 100,
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.5,
    curveRange: 0,
    curve: 0,
    ...seg,
  };
}

export function toSegmentation(sec: Section, parent: Segment): Segmentation {
  const segment = {
    count: sec.count,
    radius: calculateRadius(parent, sec),
    angle: sec.angle,
  };
  return createSegmentation(segment);
}

// Segments will have gradually increasing squiggle magnitude, supressed at speed.
export function mixSquiggleGradient(
  segmentation: Segmentation,
  waveSpec: WaveSpec,
  initialRange: number,
  supressionRange: { front: number; back: number },
): Segmentation {
  const mixed = clone(segmentation);
  const suppressionGenerator = generateSupressionGradient(
    segmentation.count,
    supressionRange,
  );
  const squiggleGenerator = generateSquiggleGradientSpec(
    segmentation.count,
    waveSpec,
    initialRange,
    0.2,
  );
  mixed.wriggle = injectWriggleSupression(
    squiggleGenerator,
    suppressionGenerator,
  );
  return mixed;
}

// Creates a series of segments with gradually increasing squiggle magnitude, supressed at speed.
export function createSquiggleGradient(
  parent: Segment,
  spec: Segmentation,
  waveSpec: WaveSpec,
  initialRange: number,
  supressionRange: { front: number; back: number },
): Segment[] {
  const suppressionGenerator = generateSupressionGradient(
    spec.count,
    supressionRange,
  );
  const squiggleGenerator = generateSquiggleGradientSpec(
    spec.count,
    waveSpec,
    initialRange,
    0.2,
  );
  const wriggleGenerator = injectWriggleSupression(
    squiggleGenerator,
    suppressionGenerator,
  );
  return createDefault(parent, spec, wriggleGenerator);
}

// Creates a noodly limb that pulls inward at high speed.
export function createNoodleLimb(
  parent: Segment,
  segmentation: Segmentation,
  waveSpec: WaveSpec,
  pullTowards: number,
): Segment[] {
  const generateWiggleSpec = (i: number) => {
    const wiggleSpec = createSquiggleSpec(waveSpec, i, segmentation.count * 2);
    wiggleSpec.suppression = {
      ...createSuppression(waveSpec.range, waveSpec.period),
      tuck: calculateTuck(segmentation.angle, pullTowards, 0.5),
    };
    return [wiggleSpec];
  };
  return createDefault(parent, segmentation, generateWiggleSpec);
}

// Creates a straight line of segments that rotate together.
export function createRotation(
  parent: Segment,
  segmentation: Segmentation,
  waveSpec: WaveSpec,
): Segment[] {
  const generateWriggleSpec = (_: number) => [createRotationSpec(waveSpec)];
  return createDefault(parent, segmentation, generateWriggleSpec);
}

// Creates a default series of segments, one after another, from segments spec and wriggle specs.
export function createDefault(
  parent: Segment,
  segmentation: Segmentation,
  generateWriggleSpec: WriggleSpecGenerator = (_: number) => [],
): Segment[] {
  const segments = [];
  let curr = parent;
  let radius = segmentation.radius;
  for (let i = 0; i < segmentation.count; i++) {
    radius = radius * segmentation.taperFactor;
    const next = createSegment(
      radius,
      segmentation.angle,
      segmentation.overlapMult,
    );
    next.bodyAngle.curveRange = segmentation.curveRange;
    next.bodyAngle.relative += i * segmentation.curve;
    next.wriggle = toWriggle(generateWriggleSpec(i));
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

export function calculateTaper(terminationFactor: number, count: number) {
  return Math.pow(terminationFactor, 1 / Math.max(1, count));
}

// // Curves given segments by a given amount.
// export function addCurve(segments: Segment[], curveAngle: number): Segment[] {
//   segments.forEach((segment, i) => {
//     segment.bodyAngle.relative += i * curveAngle;
//   });
//   return segments;
// }

// Converts a Segmentation into its corresponding Segment list.
export function asSegments(
  parent: Segment,
  segmentation: Segmentation,
): Segment[] {
  const segments = [];
  let curr = parent;
  let radius = segmentation.radius;
  for (let i = 0; i < segmentation.count; i++) {
    radius = radius * segmentation.taperFactor;
    const next = createSegment(
      radius,
      segmentation.angle,
      segmentation.overlapMult,
    );
    next.bodyAngle.curveRange = segmentation.curveRange;
    next.bodyAngle.relative += i * segmentation.curve;
    next.wriggle =
      segmentation.wriggle ? toWriggle(segmentation.wriggle(i)) : [];
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}
