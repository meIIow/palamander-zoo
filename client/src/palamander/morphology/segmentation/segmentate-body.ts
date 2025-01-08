import { Segment } from "../segment";
import { Section, createSection, follow } from "../section";
import { SegmentationFunc } from "./segmentation.ts";

/* -----------------------------------------------
 * Granular Segmentations: Re-usable Body Types
 * ----------------------------------------------- */

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


export const bodies = {
  'fish-body': segmentateFishBody,
};