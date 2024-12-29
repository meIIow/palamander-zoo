import { Segment, createSegment, createDefaultSegment } from "./segment";
import { Section, createEmptySection, createPassthruSection, toPassthruChild } from "./section";
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
    'sea-monkey': segmentateSeaMonkey,
    'tadpole': segmentateTadpole,
    // Composite
    'gills': segmentateGills,
    'mandibles': segmentateMandibles,
    'rigid_legs': segmentateRigidLegs,
    'simple-limbs': segmentateSimpleLimbs,
    // Granular
    'feeler': segmentateFeeler,
    'fish-tail': segmentateFishTail,
    'gill': segmentateGill,
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
  sectionTree.children = [
    generateGills(),
  ];
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
  const generateWriggleSpec = (i: number) => [generateSquiggleSpec(20, RELAXED_PERIOD, i, section.length+1)];
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
    sectionTree.children.push(generateRigidLegs(i, section.length));
  }
  sectionTree.children.push(generateFeeler(section.length, 12));
  sectionTree.children.push(generateFeeler(section.length, -12));
  section.children.push(generateMandibles());
  console.log(sectionTree.children);
  return processSection(parent, sectionTree, processSection);
}

const segmantateNewt: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'tadpole';
  sectionTree.children = [
    generateNewtLegs(1),
    generateNewtLegs(3),
  ];
  return processSection(parent, sectionTree, processSection);
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

// Internal Segmentation utility that defines a mirrored set of offshoots.
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

const segmentateGills: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const passthru = createPassthruSection();
  const gillAngles = [-1,0,1].map((offset) => section.angle + 30*offset);
  const gillAnglesMirror = [-1,0,1].map((offset) => -1*section.angle + 30*offset);
  passthru.children = gillAngles.concat(gillAnglesMirror).map((angle) => {
    return { ...toPassthruChild(section, 'gill'), angle };
  });
  return processSection(parent, passthru, processSection);
}

const segmentateMandibles: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentatePair(parent, section, processSection, 'mandible');
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

/* ------------------------------------------------------------
 * Lower-Level Segmentations: Re-usable (in Pals or Chimera)
 * ------------------------------------------------------------ */

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

const segmentateGill: SegmentationFunc = (
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
  const segments = createSimpleLimb(parent, spec, 10, RELAXED_PERIOD, 18);
  return segments;
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

/* ----------------------------------------------------------
 * Granular Section-Creatin Functions: Minimally re-usable
 * ---------------------------------------------------------- */

function generateFeeler(i: number, angle: number): Section {
  return {
    type: 'feeler',
    parentIndex: i,
    length: 5,
    size: 20,
    angle: angle,
    seed: 0,
    children: []
  };
}

function generateGills(): Section {
  return {
    type: 'gills',
    parentIndex: 0,
    length: 5,
    size: 10,
    angle: 60,
    seed: 0,
    children: []
  };
}

function generateMandibles(): Section {
  return {
    type: 'mandibles',
    parentIndex: 0,
    length: 5,
    size: 20,
    angle: 165,
    seed: 0,
    children: []
  };
}

function generateNewtLegs(parentIndex: number): Section {
  return {
    type: 'simple-limb',
    parentIndex,
    length: 5,
    size: 50,
    angle: 45,
    seed: 0,
    children: []
  };
}

function generateRigidLegs(parentIndex: number, _count: number): Section {
  return {
    type: 'rigid_legs',
    parentIndex,
    length: 2,
    size: 20,
    angle: 90,
    seed: (2 * Math.PI / 2)* parentIndex, // alternating offset
    //seed: (2 * Math.PI) / (count * 3) * parentIndex, // cascade offset down segment
    children: []
  };
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };