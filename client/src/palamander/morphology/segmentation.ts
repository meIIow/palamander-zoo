import { Segment, createSegment, createDefaultSegment } from "./segment";
import { Section, createEmptySection, createPassthruSection } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec, generateCurlSpec } from './wriggle';
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
    'sea-monkey': segmentateSeaMonkey,
    'starfish': segmentateStarfish,
    'tadpole': segmentateTadpole,
    // Composite
    'buggy-legs': segmentateBuggyLegs,
    'frog-arms': segmentateFrogArms,
    'gill-pair': segmentateGillPair,
    'gills': segmentateGills,
    'mandibles': segmentateMandibles,
    'noodle-limbs': segmentateNoodleLimbs,
    'nubby-legs': segmentateNubbyLegs,
    'octo-arms': segmentateOctoArms,
    'simple-limbs': segmentateSimpleLimbs,
    'starfish-arms': segmentateStarfishArms,
    // Granular
    'claws': segmentateClaws,
    'curl': segmentateCurl,
    'feeler': segmentateFeeler,
    'fish-tail': segmentateFishTail,
    'frog-legs': segmentateFrogLegs,
    'mandible': segmentateMandible,
    'monkey-arms': segmentateMonkeyArms,
    'monkey-head': segmentateMonkeyHead,
    'noodle-limb': segmentateNoodleLimb,
    'rigid-leg': segmentateRigidLeg,
    'simple-limb': segmentateSimpleLimb,
  };
}

/* -------------------------------------------------------
 * Entry-Level Segmentations: Define entire Palamanders
 * ------------------------------------------------------- */

const segmentateAxolotl: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'newt';
  sectionTree.children = [ { ...section, type: 'gill-pair', parentIndex: 0} ];
  return processSection(parent, sectionTree, processSection);
}

const segmentateCaterpillar: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: SegmentsSpec = {
    count: section.length,
    radius: section.size * 0.75,
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.1,
    curveRange: 360 / section.length,
    offset: 0
  }
  const generateWriggleSpec = (i: number) => [generateSquiggleSpec(20, RELAXED_PERIOD, i, section.length*2)];
  const body = createDefault(head, spec, generateWriggleSpec);
  return [ head, ...body];
}

const segmentateCentipede: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'caterpillar';
  sectionTree.children = [];
  for (let i = 1; i <= section.length; i++) {
    const seed = section.seed + (2 * Math.PI / 2) * i; // alternating offset
    //const seed = section.seed + (2 * Math.PI) / (count * 3) * parentIndex, // cascade offset down segment
    const legs = { ...section, type: 'buggy-legs', parentIndex: i, seed, children: [] };
    sectionTree.children.push(legs);
  }
  const feeler = { ...section, type: 'feeler', parentIndex: section.length, children: [] };
  sectionTree.children.push({ ...feeler, angle: section.angle + 12 });
  sectionTree.children.push({ ...feeler, angle: section.angle - 12 });
  section.children.push({ ...section, type: 'mandibles', children: [] });
  return processSection(parent, sectionTree, processSection);
}

const segmentateCrawdad: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spacer = createSegment(section.size, section.angle, 1);
  head.children.push(spacer);
  const body = createDefault(spacer, {
    count: 3,
    radius: section.size * 1.5,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 1,
    curveRange: 0,
    offset: section.seed,
  });

  // Process tail, legs, antennae and claws as children.
  section.children.push({
    ...createEmptySection(),
    type: 'fish-tail',
    length: 3,
    parentIndex: 4,
    size: section.size*1.5
  });

  const legs = { ...section, type: 'buggy-legs', children: [] };
  for (let i = 2; i <= 4; i++) {
    section.children.push({ ...legs, parentIndex: i });
  }

  const feeler = { ...section, type: 'feeler', parentIndex: 0, children: [] };
  section.children.push({ ...feeler, angle: section.angle + 210 });
  section.children.push({ ...feeler, angle: section.angle + 150 });

  const claws = { ...section, type: 'claws', parentIndex: 2, children: [] };
  section.children.push(claws);

  return [head, spacer, ...body];
}

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
  const arms = { ...section, type: 'simple-limbs', length: 5, size: 50, children: [] };
  section.children.push({ ...arms, size: section.size*0.2, parentIndex: 0, angle: section.angle+45 });

  const legs = { ...section, parentIndex: bodyLen, type: 'frog-legs', children: [] };
  section.children.push(legs);

  return [head, ...body];
}

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
    const generateWriggleSpec = (i: number) => [generateSquiggleSpec(20, RELAXED_PERIOD, i, section.length*2)];
    const spawn = -60 + i*40;
    const root = createSegment(1, spawn, section.size / 20);

    head.children.push(root);
    createDefault(root, tentacleSpec, generateWriggleSpec);
  }

  return [head];
}

const segmentateHorshoeCrab: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const body = createSegment(section.size*0.75, 0, 1.2);
  const legPair = { ...section, type: 'nubby-legs', parentIndex: 0, children: [] };
  [-30, 0, 30].forEach((n) => {
    processSection(body, { ...legPair, angle: section.angle + n } , processSection);
  });
  head.children.push(body);
  const tailSpike = { ...section, type: 'feeler', parentIndex: 0, children: [] }
  return [head, body, ...processSection(body, tailSpike, processSection)];
}

const segmentateNewt: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'tadpole';
  const legs = { ...section, type: 'noodle-limbs', length: 5, size: 50, children: [] };
  sectionTree.children = [
    { ...legs, parentIndex: 1, angle: section.angle+45 },
    { ...legs, parentIndex: 3, angle: section.angle+45 },
  ];
  return processSection(parent, sectionTree, processSection);
}

const segmentateOctopus: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  processSection(head, { ...section, type: 'octo-arms' }, processSection);
  return [ head];
}

const segmentateSeaMonkey: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const headSection = { ...createEmptySection(), type: 'monkey-head', size: section.size };
  const [head, neck] = processSection(parent, headSection, processSection);

  const torsoSectionSpec = {
    ...createEmptySection(),
    type: 'fish-tail',
    length: 6,
    size: section.size
  };
  const tail = processSection(neck, torsoSectionSpec, processSection);

  const armsSpec = { ...createEmptySection(), type: 'monkey-arms', size: section.size };
  processSection(tail[0], armsSpec, processSection);
  return [head, neck, ...tail];
}

const segmentateStarfish: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  processSection(head, { ...section, type: 'starfish-arms' }, processSection);
  return [ head];
}

const segmentateTadpole: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: SegmentsSpec = {
    count: section.length,
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
    mirror: boolean=true): Segment[] => {
  const passthru = createPassthruSection();
  passthru.children = [
    {...section, type, parentIndex: 0},
    {...section, type, parentIndex: 0},
  ];
  passthru.children[1].angle *= -1;
  if (mirror) passthru.children[1].seed -= Math.PI;
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
  const passthru = createPassthruSection();
  const between = range / (count-1);
  for (let i=0; i<count; i++) {
    const angle = section.angle - range/2 + i*between;
    const seed = stagger ? section.seed + 29 * i % 17 : section.seed; // random-ish bump
    const child = { ...section, type, parentIndex: 0, angle, seed };
    passthru.children.push(child);
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

const segmentateNubbyLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, length: 1, size: 30, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
}

const segmentateBuggyLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, length: 2, size: 20, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
}

const segmentateFrogArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const legs = { ...section, length: 5, size: 20, angle: 90+section.angle };
  return segmentatePair(parent, legs, processSection, 'rigid-leg');
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
  const gills = { ...section, length: 5, size: 10 }
  return segmentateEqualDistribution(parent, gills, processSection, 'curl', 3, 60);
}

const segmentateMandibles: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const mandible = { ...section, length: 5, size: 20, angle: 165 };
  return segmentatePair(parent, mandible, processSection, 'mandible');
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
  const arm = { ...section, length: 12, size: 40 }
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
  const arm = { ...section, length: 8, size: 75 }
  return segmentateRadialDistribution(parent, arm, processSection, 'curl', 5);
}

/* ------------------------------------------------------------
 * Lower-Level Segmentations: Re-usable (in Pals or Chimera)
 * ------------------------------------------------------------ */

const segmentateClaws: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  // Segmentate left and right claws as together, always.
  [-1,1].forEach((i) => {
    const lowerArmSpec: SegmentsSpec = {
      count: 3,
      radius: section.size * 0.4,
      taperFactor: 1,
      angle: parent.bodyAngle.relative + 105*i,
      overlapMult: 0.3,
      curveRange: 0,
      offset: 0
    };
    const lowerArm = createRotation(parent, lowerArmSpec, 30, 2);

    const upperArmSpec: SegmentsSpec = {
      ...lowerArmSpec,
      angle: lowerArmSpec.angle + 45*i
    };
    const upperArm = createDefault(lowerArm[2], upperArmSpec);

    // Add actual claw.
    const big = createSegment(section.size * 0.7, upperArmSpec.angle, 0.2);
    const small = createSegment(section.size * 0.6, upperArmSpec.angle + 40*i, 0.2);
    upperArm[2].children.push(big);
    upperArm[2].children.push(small);
  });
  return [];
}

const segmentateCurl: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 360 / section.length,
    offset: section.seed,
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
    offset: section.seed,
  }
  const segments = createDefault(parent, spec);
  return segments;
}

const segmentateFishTail: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const count = section.length;
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

const segmentateFrogLegs: SegmentationFunc = (
    parent: Segment,
    _section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  [-1,1].forEach((dir) => {
    const upperLegSpec: SegmentsSpec = {
      count: 3,
      radius: parent.circle.radius,
      taperFactor: 0.85,
      angle: parent.bodyAngle.relative + 75*dir,
      overlapMult: 0.3,
      curveRange: 2,
      offset: 0
    };
    const lowerArm = createRotation(parent, upperLegSpec, 45*dir, RELAXED_PERIOD);

    const lowerLegSpec: SegmentsSpec = {
      ...upperLegSpec,
      radius: parent.circle.radius * 0.7,
      angle: parent.bodyAngle.relative + 10*dir
    };
    const lowerLeg = createRotation(lowerArm[2], lowerLegSpec, 20*dir, RELAXED_PERIOD);

    // Add frog foot
    const pad = createSegment(parent.circle.radius*0.6, parent.bodyAngle.relative+10*dir, 0.5);
    let toe = createSegment(pad.circle.radius, pad.bodyAngle.relative+10, 0.5);
    toe.children.push(createSegment(toe.circle.radius, toe.bodyAngle.relative, 0.5));
    pad.children.push(toe);
    toe = createSegment(pad.circle.radius, pad.bodyAngle.relative-10, 0.5);
    toe.children.push(createSegment(toe.circle.radius, toe.bodyAngle.relative, 0.5));
    pad.children.push(toe);
    lowerLeg[2].children.push(pad);
  });
  return [];
}

const segmentateMandible: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const curve = (section.angle < 0) ? -10 : 10;
  const spec: SegmentsSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.8,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 0,
    offset: section.seed,
  }
  const segments = addCurve(createRotation(parent, spec, 5, 1), curve);
  return segments;
}

// Creates Sea Monkey arms - separated for readibility, not really that re-usable.
const segmentateMonkeyArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  [-1,1].forEach((i) => {
    const pec = createSegment(section.size * 0.75, 70*i, 1);
    pec.bodyAngle.curveRange = 0;
    parent.children.push(pec);

    const shoulder = createSegment(section.size * 0.7, 130*i, 0.6);
    shoulder.bodyAngle.curveRange = 0;
    pec.children.push(shoulder);

    const bicepSpec: SegmentsSpec = {
      count: 2,
      radius: section.size * 0.45,
      taperFactor: .9,
      angle: 75*i,
      overlapMult: 0.8,
      curveRange: 0,
      offset: 0
    };
    const upperArm = createRotation(shoulder, bicepSpec, 45, 2);

    const forearmSpec: SegmentsSpec = {
      count: 3,
      radius: section.size * 0.45,
      taperFactor: .9,
      angle: -40*i,
      overlapMult: 0.8,
      curveRange: 0,
      offset: Math.PI // forearm should swing the opposive way as bicep
    };
    const lowerArm = createRotation(upperArm[1], forearmSpec, 20, 2);

    // Turn final forearm segment into fist: bigger, with less overlap
    lowerArm[2].circle.radius = section.size * 0.6;
    lowerArm[2].overlap = 0.3*section.size;
  });
  return [];
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
    count: section.length,
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
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.2,
    curveRange: 0,
    offset: section.seed,
  }
  const segments = createRotation(parent, spec, 30, 1);
  return segments;
}

const segmentateSimpleLimb: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: SegmentsSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    curveRange: 5,
    offset: section.seed
  }
  const curve = (section.seed % (Math.PI * 2) == 0) ? 15: -15; // mirror curve
  const segments = addCurve(createRotation(parent, spec, 10, RELAXED_PERIOD), curve);
  return segments;
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };