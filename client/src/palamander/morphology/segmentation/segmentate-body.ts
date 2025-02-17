import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { Segmentation } from './segmentation.ts';
import type { SegmentationFunc } from './segmentation-func.ts';

import {
  toSegments,
  calculateTaper,
  preset,
  toSegmentation,
  mixSquiggle,
} from './segmentation.ts';
import { createBranch, createSection, follow } from '../section';

/* -----------------------------------------------
 * Granular Segmentations: re-usable Body Types
 * ----------------------------------------------- */

const segmentateEelBody: SegmentationFunc = (
  parent: Segment,
  section: Section,
): Segment[] => {
  const taperFactor = calculateTaper(0.45, section.count);
  const segmentation: Segmentation = {
    ...toSegmentation(section, parent),
    taperFactor,
    curveRange: preset.curve.squiggly,
  };
  const wave = {
    range: 20,
    period: preset.period.relaxed,
    offset: section.offset,
    acceleration: 4,
  };
  const suppression = { range: { front: 0.5, back: -0.5 } };
  const gradient = {
    wave,
    increase: 5,
    easeFactor: 0.2,
    suppression,
  };
  return toSegments(parent, mixSquiggle(segmentation, gradient));
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
    ...toSegmentation(section, parent),
    taperFactor: 1,
    overlapMult: 0.1,
    curveRange: 720 / section.count,
  };
  const wave = {
    range: 10,
    period: preset.period.relaxed * 4,
    offset: section.offset,
    acceleration: 20,
  };
  const gradient = { wave, length: section.count * 0.75 };
  const body = toSegments(parent, mixSquiggle(segmentation, gradient));
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
