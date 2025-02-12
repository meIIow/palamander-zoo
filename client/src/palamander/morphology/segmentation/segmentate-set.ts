import { Segment } from '../segment';
import { Section, createSection, replace, follow } from '../section';
import { SegmentationFunc } from './segmentation-func.ts';

/* ----------------------------------------------------------------------
 * Duplication Segmentations: Define Sets of Lower-Level Segmentations
 * ---------------------------------------------------------------------- */

const segmentateBuggyLegs: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = {
    ...replace(section),
    type: 'rigid-leg',
    count: 2,
    size: 20,
    angle: 90 + section.angle,
  };
  return follow(section, pair);
};

const segmentateClaws: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: false };
  pair.next = { ...replace(section), type: 'claw' };
  return follow(section, pair);
};

const segmentateMane: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const equal = {
    ...createSection('equal'),
    count: 30,
    angle: 240,
    mirror: false,
  };
  equal.next = { ...replace(section), type: 'hair', count: 2, size: 7 };
  return follow(section, equal);
};

const segmentateNubbyLegs: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = {
    ...replace(section),
    type: 'rigid-leg',
    count: 1,
    size: 30,
    angle: 90 + section.angle,
  };
  return follow(section, pair);
};

const segmentateFrogArms: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = {
    ...replace(section),
    type: 'rigid-leg',
    count: 5,
    size: 20,
    angle: 90 + section.angle,
  };
  return follow(section, pair);
};

const segmentateFrogLegs: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = { ...replace(section), type: 'frog-leg' };
  return follow(section, pair);
};

const segmentateGillPair: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: false };
  pair.next = { ...replace(section), type: 'gills', angle: section.angle + 60 };
  return follow(section, pair);
};

const segmentateGills: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const equal = {
    ...createSection('equal'),
    count: 3,
    angle: 60,
    mirror: true,
  };
  equal.next = { ...replace(section), type: 'curl', count: 5, size: 10 };
  return follow(section, equal);
};

const segmentateMandibles: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = {
    ...replace(section),
    type: 'mandible',
    count: 5,
    size: 20,
    angle: 165,
  };
  return follow(section, pair);
};

const segmentateMonkeyArms: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: false };
  pair.next = { ...replace(section), type: 'monkey-arm' };
  return follow(section, pair);
};

const segmentateNoodleLimbs: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = { ...replace(section), type: 'noodle-limb' };
  return follow(section, pair);
};

const segmentateOctoArms: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const equal = {
    ...createSection('equal'),
    count: 6,
    angle: 80,
    mirror: false,
  };
  equal.next = { ...replace(section), type: 'curl', count: 12, size: 40 };
  return follow(section, equal);
};

const segmentateSimpleLimbs: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const pair = { ...createSection('pair'), mirror: true };
  pair.next = { ...replace(section), type: 'simple-limb' };
  return follow(section, pair);
};

const segmentateStarfishArms: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const radial = { ...createSection('radial'), count: 5, mirror: true };
  radial.next = { ...replace(section), type: 'curl', count: 8, size: 75 };
  return follow(section, radial);
};

export const sets = {
  'buggy-legs': segmentateBuggyLegs,
  claws: segmentateClaws,
  'frog-arms': segmentateFrogArms,
  'frog-legs': segmentateFrogLegs,
  'gill-pair': segmentateGillPair,
  gills: segmentateGills,
  mane: segmentateMane,
  mandibles: segmentateMandibles,
  'monkey-arms': segmentateMonkeyArms,
  'noodle-limbs': segmentateNoodleLimbs,
  'nubby-legs': segmentateNubbyLegs,
  'octo-arms': segmentateOctoArms,
  'simple-limbs': segmentateSimpleLimbs,
  'starfish-arms': segmentateStarfishArms,
};
