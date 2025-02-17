import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { WriggleGenerator } from '../animation/wriggle-gradient.ts';
import type { WaveSpec } from '../animation/wriggle-spec.ts';

import clone from 'clone';

import { createSegment } from '../segment.ts';
import { calculateRadius } from '../section.ts';
import { toWriggle } from '../animation/wriggle.ts';
import {
  createCurlSpec,
  createRotationSpec,
} from '../animation/wriggle-spec.ts';
import {
  SquiggleGradient,
  toSquiggleGenerator,
} from '../animation/wriggle-gradient.ts';

// Config for a series of segments.
export type Segmentation = {
  count: number;
  radius: number;
  taperFactor: number;
  angle: number;
  overlapMult: number;
  curveRange: number;
  curve: number;
  wriggleGenerators: WriggleGenerator[];
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
    wriggleGenerators: [],
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

// Segments will rotate, pivoting around the parent segment
export function mixCurl(
  segmentation: Segmentation,
  wave: WaveSpec,
): Segmentation {
  const mixed = clone(segmentation);
  const generateCurl = (i: number) => toWriggle([createCurlSpec(wave, i)]);
  mixed.wriggleGenerators.push(generateCurl);
  return mixed;
}

// Segments will rotate, pivoting around the parent segment
export function mixRotation(
  segmentation: Segmentation,
  wave: WaveSpec,
): Segmentation {
  const mixed = clone(segmentation);
  const generateRotation = (_: number) => toWriggle([createRotationSpec(wave)]);
  mixed.wriggleGenerators.push(generateRotation);
  return mixed;
}

// Segments will have gradually changing squiggle magnitude, supressed at speed.
export function mixSquiggle(
  segmentation: Segmentation,
  squigglePartial: Partial<SquiggleGradient>,
): Segmentation {
  const mixed = clone(segmentation);
  if (!squigglePartial.wave) return mixed;
  const squiggle: SquiggleGradient = {
    increase: 0, // no squiggle magnitude gradient
    count: segmentation.count,
    length: segmentation.count * 2,
    angle: segmentation.angle,
    easeFactor: 1, // no easing of first segment
    wave: squigglePartial.wave,
    ...squigglePartial,
  };
  mixed.wriggleGenerators.push(toSquiggleGenerator(squiggle));
  return mixed;
}

// Convenience function to directly create a set of rotating segments.
export function createRotation(
  parent: Segment,
  segmentation: Segmentation,
  wave: WaveSpec,
): Segment[] {
  const rotation = mixRotation(segmentation, wave);
  return toSegments(parent, rotation);
}

export function calculateTaper(terminationFactor: number, count: number) {
  return Math.pow(terminationFactor, 1 / Math.max(1, count));
}

// Converts a Segmentation into its corresponding Segment list.
export function toSegments(
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
    next.wriggle = segmentation.wriggleGenerators
      .map((generate) => generate(i))
      .flat();
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}
