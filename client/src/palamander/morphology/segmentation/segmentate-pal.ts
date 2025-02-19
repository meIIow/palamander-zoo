import type { Section } from '../section.ts';
import type { Segment } from '../segment.ts';
import type { SegmentationFunc } from './segmentation-func.ts';

import { createSegment, createDefaultSegment } from '../segment';
import { createBranch, createSection, follow } from '../section';
import {
  createSegmentation,
  mixSquiggle,
  toSegments,
  preset,
} from './segmentation.ts';

// An axolotl has a newt body and gilly head.
const segmentateAxolotl: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 100 };
  head.branches.push({ ...createBranch(section, 'gill-pair'), index: 0 });
  const body = { ...createBranch(section, 'newt-body'), count: 15, size: 50 };
  follow(head, body);
  return follow(section, head);
};

// A caterpillar is an inchworm with goofy legs and mandibles.
const segmentateCaterpillar: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 100 };
  head.branches.push({ ...createBranch(section, 'mandibles') });

  const body = { ...createBranch(section, 'inchworm-body'), size: 80 };
  // Goofy alternating feet movement across segments.
  for (let i = 0; i < section.count - 1; i++) {
    const offset = section.offset + ((2 * Math.PI) / 2) * i;
    const legs = { ...createBranch(section, 'buggy-legs'), index: i, offset };
    body.branches.push(legs);
  }
  follow(head, body);
  return follow(section, head);
};

// A centipede is an inchworm with scuttling legs, mandibles, and a final-segment feeler.
const segmentateCentipede: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 100 };
  head.branches.push({ ...createBranch(section, 'mandibles') });

  const body = { ...createBranch(section, 'inchworm-body'), size: 70 };
  // Cascade feet movement down segments.
  for (let i = 0; i < section.count; i++) {
    const offset = section.offset + ((2 * Math.PI) / (section.count * 2.5)) * i;
    const legs = { ...createBranch(section, 'buggy-legs'), index: i, offset };
    body.branches.push(legs);
  }
  const feeler = { ...createBranch(section, 'feeler'), index: body.count - 1 };
  body.branches.push({ ...feeler, angle: section.angle + 12 });
  body.branches.push({ ...feeler, angle: section.angle - 12 });

  follow(head, body);
  return follow(section, head);
};

// A crawdad is a crawdad.
const segmentateCrawdad: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spacer = createSegment(section.size, section.angle, 1);
  head.children.push(spacer);

  // Create carapace.
  const body = toSegments(spacer, {
    ...createSegmentation({ count: 3, angle: section.angle }),
    radius: section.size * 1.5,
    taperFactor: 1,
    overlapMult: 1,
    curveRange: 0,
  });

  // Process tail, legs, antennae and claws as children.
  section.branches.push({
    ...createSection('fish-tail'),
    count: 3,
    index: 4,
    size: section.size * 1.5,
  });

  const legs = createBranch(section, 'buggy-legs');
  for (let i = 2; i <= 4; i++) {
    section.branches.push({ ...legs, index: i });
  }

  // TODO(mellow): add antennae Section.
  const feeler = { ...createBranch(section, 'feeler'), parentIndex: 0 };
  section.branches.push({ ...feeler, angle: section.angle + 210 });
  section.branches.push({ ...feeler, angle: section.angle + 150 });

  const claws = { ...createBranch(section, 'claws'), parentIndex: 2 };
  section.branches.push(claws);

  return [head, spacer, ...body];
};

// A frog is a frog.
const segmentateFrog: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  [-1, 1].forEach((dir) => {
    const eye = createSegment(section.size * 0.4, 150 * dir, 1.2);
    head.children.push(eye);
  });

  const bodyLen = 4;
  const bodySegmentation = createSegmentation({
    count: bodyLen,
    radius: section.size,
    taperFactor: 0.75,
    angle: section.angle,
    overlapMult: 1.2,
    curveRange: 5,
  });
  const wave = { range: 2, period: preset.period.relaxed };
  const gradient = { wave, length: bodyLen };
  const body = toSegments(head, mixSquiggle(bodySegmentation, gradient));
  const arms = { ...createBranch(section, 'simple-limbs'), count: 5, size: 50 };
  section.branches.push({
    ...arms,
    size: section.size * 0.2,
    index: 0,
    angle: section.angle + 45,
  });

  const legs = { ...createBranch(section, 'frog-legs'), index: bodyLen };
  section.branches.push(legs);

  return [head, ...body];
};

// A jellyfish is a jellyfish.
const segmentateJellyfish: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  const medulla = createSegment(section.size * 0.75, section.angle, 2.66);
  head.children.push(medulla);
  medulla.children.push(createSegment(section.size * 0.75, section.angle, 2));
  follow(section, { ...createBranch(section, 'tentacles'), index: 1 });
  return [head, medulla];
};

// A horshoe crab is a horseshoe crab.
const segmentateHorshoeCrab: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  const body = createSegment(section.size * 0.75, 0, 1.2);
  head.children.push(body);
  const legPair = { ...createBranch(section, 'nubby-legs'), index: 1 };
  [-30, 0, 30].forEach((n) => {
    section.branches.push({ ...legPair, angle: section.angle + n });
  });
  follow(section, { ...createBranch(section, 'feeler'), index: 0 });
  return [head, body];
};

// The nautilus is a submarine.
const segmentateNautilus: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const hull = createDefaultSegment(section.size);
  const pods = { ...createBranch(section, 'pods'), size: section.size * 0.5 };
  section.branches.push(pods);
  section.branches.push(createBranch(section, 'propellers'));
  return [hull];
};

// A newt is a tadpole with noodle limbs.
const segmentateNewt: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 100 };
  const body = { ...createBranch(section, 'newt-body'), count: 18, size: 60 };
  follow(head, body);
  return follow(section, head);
};

// A newt king has three newt bodies off one head.
const segmentateNewtKing: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 75 };
  const equal = {
    ...createSection('equal'),
    count: 3,
    angle: 90,
    mirror: false,
  };
  equal.next = { ...createBranch(section, 'newt-body'), count: 12, size: 50 };
  follow(head, equal);
  return follow(section, head);
};

// An octopus is an octopus.
const segmentateOctopus: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  follow(section, createBranch(section, 'octo-arms'));
  return [head];
};

// A sea lion is a sea lion.
const segmentateSeaLion: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createSection('lion-head'), size: section.size };
  follow(head, createBranch(section, 'fish-body'));
  return follow(section, head);
};

// A sea monkey is a sea monkey.
const segmentateSeaMonkey: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createSection('monkey-head'), size: section.size };
  const torso = {
    ...createSection('fish-tail'),
    count: 6,
    size: section.size,
  };
  torso.branches.push({
    ...createSection('monkey-arms'),
    size: section.size,
    index: 0,
  });
  follow(head, torso);
  return follow(section, head);
};

// A snake is a snake.
const segmentateSnake: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createSection('snake-head'), size: section.size };
  head.branches.push({
    ...createBranch(section, 'snake-body'),
    count: 8,
    index: 1,
    size: section.size * 0.7,
  });
  return follow(section, head);
};

// A starfish is a starfish.
const segmentateStarfish: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  follow(section, createBranch(section, 'starfish-arms'));
  return [head];
};

// A tadpole is a tadpole.
const segmentateTadpole: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = { ...createBranch(section, 'head'), size: 100 };
  head.branches.push({ ...createBranch(section, 'gill-pair'), index: 0 });

  follow(head, { ...createBranch(section, 'eel-body'), count: 10, size: 50 });
  follow(section, head);
  return [];
};

// A wyrm is a worm.
const segmentateWyrm: SegmentationFunc = (
  _parent: Segment,
  section: Section,
): Segment[] => {
  const head = createDefaultSegment(section.size);
  section.branches.push({
    ...createBranch(section, 'snake-body'),
    count: 6,
    size: section.size * 0.9,
  });
  return [head];
};

export const pals = {
  axolotl: segmentateAxolotl,
  caterpillar: segmentateCaterpillar,
  centipede: segmentateCentipede,
  crawdad: segmentateCrawdad,
  frog: segmentateFrog,
  jelly: segmentateJellyfish,
  'horshoe-crab': segmentateHorshoeCrab,
  nautilus: segmentateNautilus,
  newt: segmentateNewt,
  'newt-king': segmentateNewtKing,
  octopus: segmentateOctopus,
  'sea-lion': segmentateSeaLion,
  'sea-monkey': segmentateSeaMonkey,
  snake: segmentateSnake,
  starfish: segmentateStarfish,
  tadpole: segmentateTadpole,
  wyrm: segmentateWyrm,
};
