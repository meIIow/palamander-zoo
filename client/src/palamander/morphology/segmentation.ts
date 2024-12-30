import { Segment, createSegment, createDefaultSegment } from "./segment";
import { Section, createEmptySection, createPassthruSection } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec, generateCurlSpec } from './wriggle';
import { SegmentsSpec, addCurve, createSquiggleGradient, createSimpleLimb , createRotation, createDefault} from "./segments";

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
    'axolotl': segmantateAxolotl,
    'caterpillar': segmentateCaterpillar,
    'centipede': segmentateCentipede,
    'newt': segmantateNewt,
    'octopus': segmentateOctopus,
    'sea-monkey': segmentateSeaMonkey,
    'starfish': segmentateStarfish,
    'tadpole': segmentateTadpole,
    // Composite
    'gill-pair': segmentateGillPair,
    'gills': segmentateGills,
    'mandibles': segmentateMandibles,
    'octo-arms': segmentateOctoArms,
    'rigid_legs': segmentateRigidLegs,
    'simple-limbs': segmentateSimpleLimbs,
    'starfish-arms': segmentateStarfishArms,
    // Granular
    'curl': segmentateCurl,
    'feeler': segmentateFeeler,
    'fish-tail': segmentateFishTail,
    'mandible': segmentateMandible,
    'monkey-arms': segmentateMonkeyArms,
    'monkey-head': segmentateMonkeyHead,
    'rigid_leg': segmentateRigidLeg,
    'simple-limb': segmentateSimpleLimb,
  };
}

/* -------------------------------------------------------
 * Entry-Level Segmentations: Define entire Palamanders
 * ------------------------------------------------------- */

const segmantateAxolotl: SegmentationFunc = (
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
    const seed = (2 * Math.PI / 2) * i; // alternating offset
    //const seed = (2 * Math.PI) / (count * 3) * parentIndex, // cascade offset down segment
    const legs = {
      type: 'rigid_legs',
      parentIndex: i,
      length: 2,
      size: 20,
      angle: 90,
      seed,
      children: []
    };
    sectionTree.children.push(legs);
  }
  const leftFeeler = {
    type: 'feeler',
    parentIndex: section.length,
    length: 5,
    size: 20,
    angle: 12,
    seed: 0,
    children: []
  };
  sectionTree.children.push(leftFeeler);
  sectionTree.children.push({ ...leftFeeler, angle: leftFeeler.angle * -1 }); // right feeler
  section.children.push({ ...section, type: 'mandibles', children: [] });
  return processSection(parent, sectionTree, processSection);
}

const segmantateNewt: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'tadpole';
  const legs = { ...section, type: 'simple-limbs', length: 5, size: 50, children: [] };
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

  const torsoSectionSpec = { ...createEmptySection(), type: 'fish-tail', size: section.size };
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

const segmentateOctoArms: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const arm = { ...section, length: 12, size: 40 }
  return segmentateEqualDistribution(parent, arm, processSection, 'curl', 6, 80, true);
}

const segmentateRigidLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'rigid_leg');
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
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
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
  const count = 6;
  const torsoSpec: SegmentsSpec = {
    count,
    radius: section.size,
    taperFactor: .88,
    angle: 0,
    overlapMult: 0.6,
    curveRange: MUSCLEY_CURVE,
    offset: 0
  };
  const torsoWriggle = (i: number) => [generateCurlSpec(30/count, 2, i)];
  const torso = createDefault(parent, torsoSpec, torsoWriggle);
  [-1, 1].forEach((i) => {
    const fin = createSegment(section.size * 0.5, 30*i, 0.5)
    fin.wriggle = generateCompositeWriggle(torsoWriggle(count+1));
    torso[count-1].children.push(fin)
  });
  return torso;
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
    curveRange: DEFAULT_SQUIGGLY_CURVE,
    offset: 0
  }
  const segments = createSimpleLimb(parent, spec, 10, parent.bodyAngle.relative, RELAXED_PERIOD);
  return segments;
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };