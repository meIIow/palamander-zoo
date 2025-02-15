import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { Segmentation } from './segmentation.ts';
import type { SegmentationFunc } from './segmentation-func.ts';

import {
  createDefault,
  calculateTaper,
  createSquiggleGradient,
  preset,
  createSegmentation,
} from './segmentation.ts';
import {
  createBranch,
  createSection,
  calculateRadius,
  follow,
} from '../section';
import { createSquiggleSpec } from '../animation/wriggle-spec.ts';

/* -----------------------------------------------
 * Granular Segmentations: re-usable Body Types
 * ----------------------------------------------- */

const segmentateEelBody: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const taperFactor = calculateTaper(0.45, section.count);
  const segmentation: Segmentation = {
    ...createSegmentation(section.count, section.angle),
    count: section.count,
    radius: calculateRadius(parent, section),
    taperFactor,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: preset.curve.squiggly,
  };
  const waveSpec = {
    range: 25,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  return createSquiggleGradient(parent, segmentation, waveSpec, 15, {
    front: 0.5,
    back: -0.5,
  });
};

const segmentateFishBody: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const tail = {
    ...createSection('fish-tail'),
    count: 6,
    size: section.size * 0.75,
  };
  const flipper = {
    ...createSection('flipper'),
    size: section.size * 0.75,
    angle: 90,
    parentIndex: 0,
  };
  tail.branches = [flipper, { ...flipper, mirror: true, offset: Math.PI }];
  return follow(section, tail);
};

const segmentateInchwormBody: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const segmentation: Segmentation = {
    ...createSegmentation(section.count, 0),
    count: section.count,
    radius: calculateRadius(parent, section),
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.1,
    curveRange: 720 / section.count,
  };
  const waveSpec = {
    range: 10,
    period: preset.period.relaxed * 4,
    offset: section.offset,
    acceleration: 20,
  };
  const generateWriggleSpec = (i: number) => [
    createSquiggleSpec(waveSpec, i, section.count * 0.75),
  ];
  const body = createDefault(parent, segmentation, generateWriggleSpec);
  return [...body];
};

const segmentateNewtBody: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const third = Math.floor(section.count / 3); // build various body components off this count
  const body = { ...createBranch(section, 'eel-body') };
  const legs = { ...createBranch(section, 'noodle-limbs'), count: third };
  body.branches.push({ ...legs, index: 0, angle: section.angle + 45 });
  body.branches.push({ ...legs, index: third - 2, angle: section.angle + 45 });
  return follow(section, body);
};

export const bodies = {
  'eel-body': segmentateEelBody,
  'fish-body': segmentateFishBody,
  'newt-body': segmentateNewtBody,
  'inchworm-body': segmentateInchwormBody,
};
