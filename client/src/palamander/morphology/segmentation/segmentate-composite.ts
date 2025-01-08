import { Segment } from "../segment";
import { Section, createBranch, deepClone, passthru, follow } from "../section";
import { SegmentationFunc } from "./segmentation.ts";

/* -----------------------------------------------------------------------------------------
 * Composite Segmentations: Utility Segmentations for Composing Lower-Level Segmentations
 * ----------------------------------------------------------------------------------------- */

// Segmentation utility to define a mirrored set of offshoots.
const segmentatePair: SegmentationFunc = (parent: Segment, section: Section): Segment[] => {
  if (section.next == null) return [];
  const next = passthru(section.next);
  section.next = null;

  const sync = section.mirror;
  const flippedAngle = parent.bodyAngle.relative - (next.angle - parent.bodyAngle.relative);
  const secondOffset = sync ? next.offset-Math.PI : next.offset;
  section.branches = [
    deepClone(next),
    { ...deepClone(next), mirror: !next.mirror, angle: flippedAngle, offset: secondOffset },
  ];
  return [];
}

// Segmentation utility to spread offshoots evenly across a range.
const segmentateEqual: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  if (section.next == null) return [];
  const next = passthru(section.next);
  section.next = null;
  if (section.count <= 1) return follow(section, next);

  const stagger = !section.mirror;
  const range = section.angle;
  const between = range / (section.count-1);
  for (let i=0; i<section.count; i++) {
    const angle = next.angle - range/2 + i*between;
    const offset = stagger ? next.offset + 29 * i % 17 : section.offset; // random-ish bump
    const child = { ...deepClone(next), angle, offset };
    section.branches.push(child);
  }
  return [];
}

// Segmentation utility to spread offshoots evenly across the whole segment.
const segmentateRadial: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  if (section.next == null) return [];
  const next = passthru(section.next);
  section.next = null;
  if (section.count <= 1) return follow(section, next);
  const range = 360 - 360/section.count; // if 360, first and last will overlap;
  const equal = { ...createBranch(section, 'equal'), angle: range };
  equal.next = next;
  return follow(section, equal);
}

export const composites = {
  'pair': segmentatePair,
  'equal': segmentateEqual,
  'radial': segmentateRadial,
};