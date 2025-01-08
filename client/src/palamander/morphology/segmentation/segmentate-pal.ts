import { Segment, createSegment, createDefaultSegment } from "../segment";
import { Section, calculateRadius, createBranch, createSection, follow } from "../section";
import { createSquiggleSpec } from '../animation/wriggle-spec';
import { SegmentsSpec, createSquiggleGradient, createDefault} from "./segments";
import { SegmentationFunc, preset } from "./segmentation.ts";

// An axolotl is a newt with a gill-pair on its head.
const segmentateAxolotl: SegmentationFunc = (
    _parent: Segment,
    section: Section): Segment[] => {
  const axolotl = {...section};
  axolotl.type = 'newt';
  axolotl.branches = [ { ...createBranch(section, 'gill-pair'), index: 0 } ];
  return follow(section, axolotl);
}

// A caterpillar is a caterpillar.
const segmentateCaterpillar: SegmentationFunc = (parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(parent.circle.radius);
  const spec: SegmentsSpec = {
    count: section.count,
    radius: calculateRadius(parent, section),
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.1,
    curveRange: 360 / section.count,
  };
  const waveSpec = { range: 20, period: preset.period.relaxed, offset: section.offset }
  const generateWriggleSpec = (i: number) => [createSquiggleSpec(waveSpec, i, section.count*2)];
  const body = createDefault(head, spec, generateWriggleSpec);
  return [ head, ...body];
}

// A centipede is a caterpillar with mandibles, legs, and a final-segment feeler.
const segmentateCentipede: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const caterpillar = { ...createBranch(section, 'caterpillar'), size: 75 };
  for (let i = 1; i <= section.count; i++) {
    const offset = section.offset + (2 * Math.PI / 2) * i; // alternating offset
    //const seed = section.seed + (2 * Math.PI) / (count * 3) * parentIndex, // cascade offset down segment
    const legs = { ...createBranch(section, 'buggy-legs'), index: i, offset };
    caterpillar.branches.push(legs);
  }
  // TODO(mellow): add antennae Section.
  const feeler = { ...createBranch(section, 'feeler'), index: section.count };
  caterpillar.branches.push({ ...feeler, angle: section.angle + 12 });
  caterpillar.branches.push({ ...feeler, angle: section.angle - 12 });
  caterpillar.branches.push({ ...createBranch(section, 'mandibles') });
  return follow(section, caterpillar);
}

// A crawdad is a crawdad.
const segmentateCrawdad: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spacer = createSegment(section.size, section.angle, 1);
  head.children.push(spacer);

  // Create carapace.
  const body = createDefault(spacer, {
    count: 3,
    radius: section.size * 1.5,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 1,
    curveRange: 0,
  });

  // Process tail, legs, antennae and claws as children.
  section.branches.push({
    ...createSection('fish-tail'),
    count: 3,
    index: 4,
    size: section.size*1.5
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
}

// A frog is a frog.
const segmentateFrog: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  [-1, 1].forEach((dir)=> {
    const eye = createSegment(section.size*0.4, 150*dir, 1.2);
    head.children.push(eye);
  })

  const bodyLen = 4;
  const bodySpec = {
    count: bodyLen,
    radius: section.size,
    taperFactor: 0.75,
    angle: section.angle,
    overlapMult: 1.2,
    curveRange: 5,
    offset: 0
  }
  const waveSpec = { range: 2, period: preset.period.relaxed }
  const generateFrogWiggle = (i: number) => [createSquiggleSpec(waveSpec, i, bodyLen)];
  const body  = createDefault(head, bodySpec, generateFrogWiggle);
  const arms = { ...createBranch(section, 'simple-limbs'), count: 5, size: 50 };
  section.branches.push({ ...arms, size: section.size*0.2, index: 0, angle: section.angle+45 });

  const legs = { ...createBranch(section, 'frog-legs'), index: bodyLen };
  section.branches.push(legs);

  return [head, ...body];
}

// A jellyfish is a jellyfish.
const segmentateJellyfish: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);

  const tentacleSpec = {
    count: 5,
    radius: section.size * .2,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0,
    curveRange: 30 / 5,
    offset: 0,
  };
  for (let i=0; i<4; i++) {
    const waveSpec = { range: 20, period: preset.period.relaxed, offset: section.offset }
    const generateWriggleSpec = (i: number) => [createSquiggleSpec(waveSpec, i, section.count*2)];
    const spawn = -60 + i*40;
    const root = createSegment(1, spawn, section.size / 20);

    head.children.push(root);
    createDefault(root, tentacleSpec, generateWriggleSpec);
  }

  return [head];
}

// A horshoe crab is a horseshoe crab.
const segmentateHorshoeCrab: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  const body = createSegment(section.size*0.75, 0, 1.2);
  head.children.push(body);
  const legPair = { ...createBranch(section, 'nubby-legs'), index: 1 };
  [-30, 0, 30].forEach((n) => {
    section.branches.push({ ...legPair, angle: section.angle + n });
  });
  follow(section, { ...createBranch(section, 'feeler'), index: 0 });
  return [head, body];
}

// A newt is a tadpole with noodle limbs.
const segmentateNewt: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const newt = { ...createBranch(section, 'tadpole') };
  const legs = { ...createBranch(section, 'noodle-limbs'), count: 5, size: 50 };
  newt.branches = newt.branches.concat([
    { ...legs, index: 1, angle: section.angle+45 },
    { ...legs, index: 3, angle: section.angle+45 },
  ]);
  follow(section, newt);
  return [];
}

// An octopus is an octopus.
const segmentateOctopus: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  follow(section, createBranch(section, 'octo-arms'));
  return [ head ];
}

// A sea lion is a sea lion.
const segmentateSeaLion: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = { ...createSection('lion-head'), size: section.size };
  follow(head, createBranch(section, 'fish-body'));
  return follow(section, head);
}

// A sea monkey is a sea monkey.
const segmentateSeaMonkey: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = { ...createSection('monkey-head'), size: section.size };
  const torso = {
    ...createSection('fish-tail'),
    count: 6,
    size: section.size
  };
  torso.branches.push({ ...createSection('monkey-arms'), size: section.size, index: 0 });
  follow(head, torso);
  return follow(section, head);
}

// A starfish is a starfish.
const segmentateStarfish: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  follow(section, createBranch(section, 'starfish-arms'));
  return [ head ];
}

// A tadpole is a tadpole.
const segmentateTadpole: SegmentationFunc = (_parent: Segment, section: Section): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: SegmentsSpec = {
    count: section.count,
    radius: section.size / 2,
    taperFactor: 0.95,
    angle: 0,
    overlapMult: 0.5,
    curveRange: preset.curve.squiggly,
  }
  const waveSpec = { range: 25, period: preset.period.relaxed, offset: section.offset };
  const body = createSquiggleGradient(head, spec, waveSpec, 15, { front: 0.5, back: -0.5 });
  return [ head, ...body];
}

export const pals = {
  'axolotl': segmentateAxolotl,
  'caterpillar': segmentateCaterpillar,
  'centipede': segmentateCentipede,
  'crawdad': segmentateCrawdad,
  'frog': segmentateFrog,
  'jellyfish': segmentateJellyfish,
  'horshoe-crab': segmentateHorshoeCrab,
  'newt': segmentateNewt,
  'octopus': segmentateOctopus,
  'sea-lion': segmentateSeaLion,
  'sea-monkey': segmentateSeaMonkey,
  'starfish': segmentateStarfish,
  'tadpole': segmentateTadpole,
};