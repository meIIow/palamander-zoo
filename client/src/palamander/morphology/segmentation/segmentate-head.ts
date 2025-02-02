import { Segment, createSegment, createDefaultSegment } from '../segment';
import { Section, createBranch } from '../section';
import { SegmentationFunc } from './segmentation.ts';

/* -----------------------------------------------
 * Granular Segmentations: Re-usable Head Types
 * ----------------------------------------------- */

const segmentateHead: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  return [createDefaultSegment(section.size)];
};

const segmentateLionHead: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createSegment(section.size, section.angle, 0);

  [-1, 1].forEach((i) => {
    const ear = createSegment(section.size * 0.4, 80 * i, 1);
    ear.bodyAngle.curveRange = 0;
    head.children.push(ear);
  });

  const snout = createSegment(section.size * 0.75, 180, 1.5);
  head.children.push(snout);

  const neck = createSegment(section.size * 0.5, 0, 0.8);
  head.children.push(neck);

  const mane = createBranch(section, 'mane');
  section.branches.push(mane);

  return [head, neck];
};

const segmentateMonkeyHead: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createSegment(section.size, section.angle, 0);

  [-1, 1].forEach((i) => {
    const ear = createSegment(section.size * 0.4, 90 * i, 0.6);
    head.children.push(ear);
  });

  const neck = createSegment(section.size * 0.4, section.angle, 0.8);
  head.children.push(neck);

  return [head, neck];
};

export const heads = {
  head: segmentateHead,
  'lion-head': segmentateLionHead,
  'monkey-head': segmentateMonkeyHead,
};
