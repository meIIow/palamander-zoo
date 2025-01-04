import { Segment, createSegment, createDefaultSegment } from "./segment";
import { Section, calculateRadius, createBranch, createSection, createPassthru } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec, generateCurlSpec, generateRotationSpec, generateWriggle } from './wriggle';
import { SegmentsSpec, addCurve, createSquiggleGradient, createNoodleLimb , createRotation, createDefault} from "./segments";

// A function that breaks down a given Section into its component Segments.
type SegmentationFunc = (parent: Segment, section: Section, segmentate: SegmentationFunc) => Segment[];

const DEFAULT_SQUIGGLY_CURVE = 20;
const MUSCLEY_CURVE = 10;
const RELAXED_PERIOD = 2.5;

interface SegmentationMap {
  [key: string]: SegmentationFunc;
}

function getDefaultSegmentationMap(): SegmentationMap{
  return {
    // Entry-level
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
    // Composite
    'buggy-legs': segmentateBuggyLegs,
    'claws': segmentateClaws,
    'frog-arms': segmentateFrogArms,
    'frog-legs': segmentateFrogLegs,
    'gill-pair': segmentateGillPair,
    'gills': segmentateGills,
    'mane': segmentateMane,
    'mandibles': segmentateMandibles,
    'monkey-arms': segmentateMonkeyArms,
    'noodle-limbs': segmentateNoodleLimbs,
    'nubby-legs': segmentateNubbyLegs,
    'octo-arms': segmentateOctoArms,
    'simple-limbs': segmentateSimpleLimbs,
    'starfish-arms': segmentateStarfishArms,
    // Granular
    'claw': segmentateClaw,
    'curl': segmentateCurl,
    'feeler': segmentateFeeler,
    'fish-tail': segmentateFishTail,
    'flipper': segmentateFlipper,
    'frog-leg': segmentateFrogLeg,
    'hair': segmentateHair,
    'lion-head': segmentateLionHead,
    'mandible': segmentateMandible,
    'monkey-arm': segmentateMonkeyArm,
    'monkey-head': segmentateMonkeyHead,
    'noodle-limb': segmentateNoodleLimb,
    'rigid-leg': segmentateRigidLeg,
    'simple-limb': segmentateSimpleLimb,
  };
}

/* -------------------------------------------------------
 * Entry-Level Segmentations: Define entire Palamanders
 * ------------------------------------------------------- */

// An axolotl is a newt with a gill-pair on its head.
const segmentateAxolotl: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'newt';
  sectionTree.branches = [ { ...createBranch(section, 'gill-pair'), index: 0 } ];
  return processSection(parent, sectionTree, processSection);
}

// A caterpillar is a caterpillar.
const segmentateCaterpillar: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(parent.circle.radius);
  const spec: SegmentsSpec = {
    count: section.count,
    radius: calculateRadius(parent, section),
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.1,
    curveRange: 360 / section.count,
    offset: 0
  };
  const generateWriggleSpec = (i: number) => [generateSquiggleSpec(20, RELAXED_PERIOD, i, section.count*2)];
  const body = createDefault(head, spec, generateWriggleSpec);
  return [ head, ...body];
}

// A centipede is a caterpillar with mandibles, legs, and a final-segment feeler.
const segmentateCentipede: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
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
  return processSection(parent, caterpillar, processSection);
}

// A crawdad is a crawdad.
const segmentateCrawdad: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
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
    offset: section.offset,
  });

  // Process tail, legs, antennae and claws as children.
  section.branches.push({
    ...createSection(),
    type: 'fish-tail',
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
const segmentateFrog: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
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
  const generateFrogWiggle = (i: number) => [generateSquiggleSpec(2, RELAXED_PERIOD, i, bodyLen)];
  const body  = createDefault(head, bodySpec, generateFrogWiggle);
  const arms = { ...createBranch(section, 'simple-limbs'), count: 5, size: 50 };
  section.branches.push({ ...arms, size: section.size*0.2, index: 0, angle: section.angle+45 });

  const legs = { ...createBranch(section, 'frog-legs'), index: bodyLen };
  section.branches.push(legs);

  return [head, ...body];
}

// A jellyfish is a jellyfish.
const segmentateJellyfish: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
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
    const generateWriggleSpec = (i: number) => [generateSquiggleSpec(20, RELAXED_PERIOD, i, section.count*2)];
    const spawn = -60 + i*40;
    const root = createSegment(1, spawn, section.size / 20);

    head.children.push(root);
    createDefault(root, tentacleSpec, generateWriggleSpec);
  }

  return [head];
}

// A horshoe crab is a horseshoe crab.
const segmentateHorshoeCrab: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const body = createSegment(section.size*0.75, 0, 1.2);
  const legPair = { ...createBranch(section, 'nubby-legs'), index: 0 };
  [-30, 0, 30].forEach((n) => {
    processSection(body, { ...legPair, angle: section.angle + n } , processSection);
  });
  head.children.push(body);
  const tailSpike = { ...createBranch(section, 'feeler'), index: 0 }
  return [head, body, ...processSection(body, tailSpike, processSection)];
}

// A newt is a tadpole with noodle limbs.
const segmentateNewt: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'tadpole';
  const legs = { ...createBranch(section, 'noodle-limbs'), count: 5, size: 50 };
  sectionTree.branches = [
    { ...legs, index: 1, angle: section.angle+45 },
    { ...legs, index: 3, angle: section.angle+45 },
  ];
  return processSection(parent, sectionTree, processSection);
}

// An octopus is an octopus.
const segmentateOctopus: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  processSection(head, createBranch(section, 'octo-arms'), processSection);
  return [ head];
}

// A sea lion is a sea lion.
const segmentateSeaLion: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const headSection = { ...createSection(), type: 'lion-head', size: section.size };
  const [head] = processSection(parent, headSection, processSection);

  const neck = createSegment(section.size * 0.5, 0, 0.8);
  head.children.push(neck)

  const tailSectionSpec = {
    ...createSection(),
    type: 'fish-tail',
    count: 6,
    size: section.size * 0.75
  };
  const flipper = {
    ...createSection(),
    type: 'flipper',
    size: section.size * 0.75,
    angle: 90,
    parentIndex: 0,
  };
  tailSectionSpec.branches = [flipper, { ...flipper, mirror: true, offset: Math.PI }];
  const tail = processSection(neck, tailSectionSpec, processSection);

  return [head, neck, ...tail];
}

// A sea monkey is a sea monkey.
const segmentateSeaMonkey: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const headSection = { ...createSection(), type: 'monkey-head', size: section.size };
  const [head, neck] = processSection(parent, headSection, processSection);

  const torsoSectionSpec = {
    ...createSection(),
    type: 'fish-tail',
    count: 6,
    size: section.size
  };
  const tail = processSection(neck, torsoSectionSpec, processSection);

  const armsSpec = { ...createSection(), type: 'monkey-arms', size: section.size };
  processSection(tail[0], armsSpec, processSection);
  return [head, neck, ...tail];
}

// A starfish is a starfish.
const segmentateStarfish: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  processSection(head, createBranch(section, 'starfish-arms'), processSection);
  return [ head];
}

// A tadpole is a tadpole.
const segmentateTadpole: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: SegmentsSpec = {
    count: section.count,
    radius: section.size / 2,
    taperFactor: 0.95,
    angle: 0,
    overlapMult: 0.5,
    curveRange: DEFAULT_SQUIGGLY_CURVE,
    offset: 0
  }
  const body = createSquiggleGradient(head, spec, RELAXED_PERIOD, 10, 25, 0.5);
  return [ head, ...body];
}

/* ----------------------------------------------------------------------
 * Duplication Segmentations: Define Sets of Lower-Level Segmentations
 * ---------------------------------------------------------------------- */

// Segmentation utility to define a mirrored set of offshoots.
const segmentatePair = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc,
    type: string,
    sync: boolean=true): Segment[] => {
  const passthru = createPassthru();
  const flippedAngle = parent.bodyAngle.relative - (section.angle - parent.bodyAngle.relative);
  passthru.branches = [
    { ...section, type, index: 0 },
    { ...section, type, index: 0, mirror: !section.mirror, angle: flippedAngle },
  ];
  if (sync) passthru.branches[1].offset -= Math.PI;
  return processSection(parent, passthru, processSection);
}

// Segmentation utility to spread offshoots evenly across a range.
const segmentateEqualDistribution = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc,
    type: string,
    count: number,
    range: number,
    stagger: boolean = false): Segment[] => {
  if (count <= 1) processSection(parent, { ...section, type }, processSection);
  const passthru = createPassthru();
  const between = range / (count-1);
  for (let i=0; i<count; i++) {
    const angle = section.angle - range/2 + i*between;
    const offset = stagger ? section.offset + 29 * i % 17 : section.offset; // random-ish bump
    const child = { ...section, type, index: 0, angle, offset };
    passthru.branches.push(child);
  }
  return processSection(parent, passthru, processSection);
}

// Segmentation utility to spread offshoots evenly across the whole segment.
const segmentateRadialDistribution = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc,
    type: string,
    count: number): Segment[] => {
  if (count <= 1) processSection(parent, { ...section, type }, processSection);
  const range = 360 - 360/count; // if 360, first and last will overlap;
  return segmentateEqualDistribution(parent, section, processSection, type, count, range);
}

const segmentateBuggyLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, count: 2, size: 20, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
}

const segmentateClaws: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'claw', false);
}

const segmentateMane: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const hair = { ...section, count: 2, size: 7 };
  return segmentateEqualDistribution(parent, hair, processSection, 'hair', 30, 240, true);
}

const segmentateNubbyLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, count: 1, size: 30, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
}

const segmentateFrogArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, count: 5, size: 20, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
}

const segmentateFrogLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'frog-leg');
}

const segmentateGillPair: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const gillsSection = { ...section, angle: section.angle + 60 };
  return segmentatePair(parent, gillsSection, processSection, 'gills', false);
}

const segmentateGills: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const gills = { ...section, count: 5, size: 10 }
  return segmentateEqualDistribution(parent, gills, processSection, 'curl', 3, 60);
}

const segmentateMandibles: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const mandible = { ...section, count: 5, size: 20, angle: 165 };
  return segmentatePair(parent, mandible, processSection, 'mandible');
}

const segmentateMonkeyArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'monkey-arm', false);
}

const segmentateNoodleLimbs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'noodle-limb');
}

const segmentateOctoArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const arm = { ...section, count: 12, size: 40 }
  return segmentateEqualDistribution(parent, arm, processSection, 'curl', 6, 80, true);
}

const segmentateSimpleLimbs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'simple-limb');
}

const segmentateStarfishArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const arm = { ...section, count: 8, size: 75 }
  return segmentateRadialDistribution(parent, arm, processSection, 'curl', 5);
}

/* ------------------------------------------------------------
 * Lower-Level Segmentations: Re-usable (in Pals or Chimera)
 * ------------------------------------------------------------ */

const segmentateClaw: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const upperArmSpec: SegmentsSpec = {
    count: 3,
    radius: section.size * 0.4,
    taperFactor: 1,
    angle: parent.bodyAngle.relative + 105 * dir,
    overlapMult: 0.3,
    curveRange: 0,
    offset: 0
  };
  const upperArm = createRotation(parent, upperArmSpec, 30, 2);

  const lowerArmSpec: SegmentsSpec = {
    ...upperArmSpec,
    angle: upperArmSpec.angle + 45 * dir
  };
  const lowerArm = createDefault(upperArm[2], lowerArmSpec);

  // Add actual claw.
  const big = createSegment(section.size * 0.7, lowerArmSpec.angle, 0.2);
  const small = createSegment(section.size * 0.6, lowerArmSpec.angle + 40*dir, 0.2);
  lowerArm[2].children.push(big);
  lowerArm[2].children.push(small);
  return [ ...upperArm, ...lowerArm ];
}

const segmentateCurl: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 360 / section.count,
    offset: section.offset,
  };
  const generateGentleCurl = (i: number) => [generateCurlSpec(120/spec.count, 2, i, spec.offset)]
  const segments = createDefault(parent, spec, generateGentleCurl);
  return segments;
}

const segmentateFeeler: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: 5,
    radius: parent.circle.radius * 20 / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.2,
    curveRange: 0,
    offset: section.offset,
  }
  const segments = createDefault(parent, spec);
  return segments;
}

const segmentateFishTail: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const count = section.count;
  const tailSpec: SegmentsSpec = {
    count,
    radius: section.size,
    taperFactor: .88,
    angle: 0,
    overlapMult: 0.6,
    curveRange: MUSCLEY_CURVE,
    offset: 0
  };
  const tailWriggle = (i: number) => [generateCurlSpec(30/count, 2, i)];
  const tail = createDefault(parent, tailSpec, tailWriggle);
  [-1, 1].forEach((i) => {
    const fin = createSegment(section.size * 0.5, 30*i, 0.5)
    fin.wriggle = generateCompositeWriggle(tailWriggle(count+1));
    tail[count-1].children.push(fin)
  });
  return tail;
}

const segmentateFlipper: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const sizes = [40, 50, 60, 70, 40, 20];
  const curve = 15 * dir;
  let curr = parent;
  const flipper = sizes.map((size, i) => {
    const angle = section.angle*dir - i*curve;
    return createSegment(section.size*size/100, angle, 1.2);
  });
  flipper.forEach((segment) => {
    curr.children.push(segment);
    segment.wriggle = generateWriggle(generateRotationSpec(20, RELAXED_PERIOD, section.offset));
    curr = segment;
  });
  return flipper;
}

const segmentateFrogLeg: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const dir = section.mirror ? -1 : 1;
  const upperLegSpec: SegmentsSpec = {
    count: 3,
    radius: parent.circle.radius,
    taperFactor: 0.85,
    angle: parent.bodyAngle.relative + 75*dir,
    overlapMult: 0.3,
    curveRange: 2,
    offset: 0
  };
  const upperLeg = createRotation(parent, upperLegSpec, 45*dir, RELAXED_PERIOD);

  const lowerLegSpec: SegmentsSpec = {
    ...upperLegSpec,
    radius: parent.circle.radius * 0.7,
    angle: parent.bodyAngle.relative + 10*dir
  };
  const lowerLeg = createRotation(upperLeg[2], lowerLegSpec, 20*dir, RELAXED_PERIOD);

  // Add frog foot
  const pad = createSegment(parent.circle.radius*0.6, parent.bodyAngle.relative+10*dir, 0.5);
  [1, -1].forEach((toeDir) => {
    const toe = createSegment(pad.circle.radius, pad.bodyAngle.relative+10*toeDir, 0.5);
    toe.children.push(createSegment(toe.circle.radius, toe.bodyAngle.relative, 0.5));
    pad.children.push(toe);
  });
  lowerLeg[2].children.push(pad);
  return [...upperLeg, ...lowerLeg, pad];
}

const segmentateHair: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 1.25,
    curveRange: 20,
    offset: section.offset,
  };
  const generateGentleCurl = (i: number) => {
    return [
      generateRotationSpec(5, RELAXED_PERIOD, spec.offset),
      generateCurlSpec(30, 2, i, spec.offset)
    ];
  };
  const segments = createDefault(parent, spec, generateGentleCurl);
  return segments;
}

const segmentateLionHead: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);

  [-1,1].forEach((i) => {
    const ear = createSegment(section.size * 0.4, 80*i, 1);
    ear.bodyAngle.curveRange = 0;
    head.children.push(ear);
  });

  const snout = createSegment(section.size*0.75, 180, 1.5);
  head.children.push(snout);

  const mane = createBranch(section, 'mane');
  section.branches.push(mane);

  return [head];
}

const segmentateMandible: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const curve = (section.angle < 0) ? -10 : 10;
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.8,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 0,
    offset: section.offset,
  }
  const segments = addCurve(createRotation(parent, spec, 5, 1), curve);
  return segments;
}

const segmentateMonkeyArm: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const dir = section.mirror ? -1 : 1;

  const pec = createSegment(section.size * 0.75, 70 * dir, 1);
  parent.children.push(pec);

  const shoulder = createSegment(section.size * 0.7, 130 * dir, 0.6);
  pec.children.push(shoulder);

  const upperArmSpec: SegmentsSpec = {
    count: 2,
    radius: section.size * 0.45,
    taperFactor: .9,
    angle: 75 * dir,
    overlapMult: 0.8,
    curveRange: 0,
    offset: 0
  };
  const upperArm = createRotation(shoulder, upperArmSpec, 45, 2);

  const forearmSpec: SegmentsSpec = {
    count: 3,
    radius: section.size * 0.45,
    taperFactor: .9,
    angle: -40 * dir,
    overlapMult: 0.8,
    curveRange: 0,
    offset: Math.PI // forearm should swing the opposive way as bicep
  };
  const forearm = createRotation(upperArm[1], forearmSpec, 20, 2);

  // Turn final forearm segment into fist: bigger, with less overlap
  forearm[2].circle.radius = section.size * 0.6;
  forearm[2].overlap = 0.3*section.size;
  return [ pec, shoulder, ...upperArm, ...forearm ];
}

const segmentateMonkeyHead: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);

  [-1,1].forEach((i) => {
    const ear = createSegment(section.size * 0.4, 90*i, 0.6);
    ear.bodyAngle.curveRange = 0;
    head.children.push(ear);
  });

  const neck = createSegment(section.size * 0.4, 0, 0.8);
  neck.bodyAngle.curveRange = 0;
  head.children.push(neck)

  return [head, neck];
}

const segmentateNoodleLimb: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: DEFAULT_SQUIGGLY_CURVE,
    offset: 0
  }
  const segments = createNoodleLimb(parent, spec, 10, parent.bodyAngle.relative, RELAXED_PERIOD);
  return segments;
}

const segmentateRigidLeg: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.2,
    curveRange: 0,
    offset: section.offset,
  }
  const segments = createRotation(parent, spec, 30, 1);
  return segments;
}

const segmentateSimpleLimb: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.count,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 5,
    offset: section.offset
  }
  const curve = (section.offset % (Math.PI * 2) == 0) ? 15: -15; // mirror curve
  const segments = addCurve(createRotation(parent, spec, 10, RELAXED_PERIOD), curve);
  return segments;
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };