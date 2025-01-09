import { Segment } from "../segment";
import { SegmentsSpec, calculateTaper, createSquiggleGradient } from './segments';
import { Section, createBranch, createSection, calculateRadius, follow } from "../section";
import { SegmentationFunc, preset } from "./segmentation.ts";

/* -----------------------------------------------
 * Granular Segmentations: re-usable Body Types
 * ----------------------------------------------- */

const segmentateEelBody: SegmentationFunc = (parent: Segment, section: Section): Segment[] => {
  const taperFactor = calculateTaper(0.45, section.count);
  const spec: SegmentsSpec = {
    count: section.count,
    radius: calculateRadius(parent, section),
    taperFactor,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: preset.curve.squiggly,
  }
  const waveSpec = { range: 25, period: preset.period.relaxed, offset: section.offset };
  return createSquiggleGradient(parent, spec, waveSpec, 15, { front: 0.5, back: -0.5 });
}

const segmentateFishBody: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const tail = {
    ...createSection('fish-tail'),
    count: 6,
    size: section.size * 0.75
  };
  const flipper = {
    ...createSection('flipper'),
    size: section.size * 0.75,
    angle: 90,
    parentIndex: 0,
  };
  tail.branches = [flipper, { ...flipper, mirror: true, offset: Math.PI }];
  return follow(section, tail);
}

const segmentateNewtBody: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const third = Math.floor(section.count / 3); // build various body components off this count
  const body = { ...createBranch(section, 'eel-body') };
  const legs = { ...createBranch(section, 'noodle-limbs'), count: third };
  body.branches.push({ ...legs, index: 0, angle: section.angle+45 });
  body.branches.push({ ...legs, index: third-2, angle: section.angle+45 });
  return follow(section, body);
}

export const bodies = {
  'eel-body': segmentateEelBody,
  'fish-body': segmentateFishBody,
  'newt-body': segmentateNewtBody,
};