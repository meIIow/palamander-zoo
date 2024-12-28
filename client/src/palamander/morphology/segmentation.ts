import { Segment, createSegment, createDefaultSegment } from "./segment";
import { Section, createEmptySection, createPassthruSection, toPassthruChild } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec, generateCurlSpec, WriggleSpec, generateRotationSpec } from './wriggle';

// A function that breaks down a given Section into its component Segments.
type SegmentationFunc = (parent: Segment, section: Section, segmentate: SegmentationFunc) => Segment[];

interface SegmentationMap {
  [key: string]: SegmentationFunc;
}

function getDefaultSegmentationMap(): SegmentationMap{
  return {
      'axolotl': segmantateAxolotl,
      'newt': segmantateNewt,
      'tadpole': segmentateTadpole,
      'centipede': segmentateCentipede,
      'caterpillar': segmentateCaterpillar,
      'sea-monkey': segmentateSeaMonkey,
      'monkey-head': segmentateMonkeyHead,
      'monkey-arms': segmentateMonkeyArms,
      'fish-tail': segmentateFishTail,
      'feeler': segmentateFeeler,
      'leg': segmentateLeg,
      'legs': segmentateLegs,
      'rigid_legs': segmentateRigidLegs,
      'rigid_leg': segmentateRigidLeg,
      'mandible': segmentateMandible,
      'mandibles': segmentateMandibles,
      'gill': segmentateGill,
      'gills': segmentateGills,
    }
}

/* TOP-LEVEL SEGMENTATION FUNCTIONS */

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

const segmentateTadpole: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: section.size / 2,
    taperFactor: 0.95,
    angle: 0,
    overlapMult: 0.5,
    offset: 0
  }
  const body = createTadpoleSegments(head, spec);
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

const segmentateCaterpillar: SegmentationFunc = (
    _parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const head = createDefaultSegment(section.size);
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: section.size * 0.75,
    taperFactor: 1,
    angle: 0,
    overlapMult: 0.1,
    offset: 0
  }
  const generateWriggleSpec = (i: number) => [generateSquiggleSpec(10, 5, i, section.length*2)];
  const body = createTaperedSegments(head, spec, generateWriggleSpec);
  return [ head, ...body];
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

const segmentateFishTail: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const count = 6;
  const torsoSpec: TaperedSegmentSpec = {
    count,
    radius: section.size,
    taperFactor: .88,
    angle: 0,
    overlapMult: 0.6,
    offset: 0
  };
  const torsoWriggle = (i: number) => [generateCurlSpec(30/count, 2, i)];
  const torso = createTaperedSegments(parent, torsoSpec, torsoWriggle);
  torso.forEach((segment) => segment.bodyAngle.curveRange = 10);
  [-1, 1].forEach((i) => {
    const fin = createSegment(section.size * 0.5, 30*i, 0.5)
    fin.wriggle = generateCompositeWriggle(torsoWriggle(count+1));
    torso[count-1].children.push(fin)
  });
  return torso;
}

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

    const bicepSpec: TaperedSegmentSpec = {
      count: 2,
      radius: section.size * 0.45,
      taperFactor: .9,
      angle: 75*i,
      overlapMult: 0.8,
      offset: 0
    };
    const upperArm = createRotationSegments(shoulder, bicepSpec, 45, 2);

    const forearmSpec: TaperedSegmentSpec = {
      count: 3,
      radius: section.size * 0.45,
      taperFactor: .9,
      angle: -40*i,
      overlapMult: 0.8,
      offset: Math.PI // forearm should swing the opposive way as bicep
    };
    const lowerArm = createRotationSegments(upperArm[1], forearmSpec, 20, 2);

    // Turn final forearm segment into fist: bigger, with less overlap
    lowerArm[2].circle.radius = section.size * 0.6;
    lowerArm[2].overlap = 0.3*section.size;
  });
  return [];
}

const segmentateLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentateMirroredPair(parent, section, processSection, 'leg');
}

const segmentateRigidLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentateMirroredPair(parent, section, processSection, 'rigid_leg');
}

const segmentateMandibles: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  return segmentateMirroredPair(parent, section, processSection, 'mandible');
}

const segmentateMirroredPair = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc,
    type: string): Segment[] => {
  const passthru = createPassthruSection();
  passthru.children = [
    {...section, type, parentIndex: 0},
    {...section, type, parentIndex: 0},
  ];
  passthru.children[1].angle *= -1;
  passthru.children[1].seed -= Math.PI;
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

const segmentateLeg: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    offset: 0
  }
  const segments = createLegSegments(parent, spec);
  return segments;
}

const segmentateRigidLeg: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 1,
    angle: section.angle,
    overlapMult: 0.2,
    offset: section.seed,
  }
  const segments = createRotationSegments(parent, spec, 30, 1);
  return segments;
}

const segmentateGill: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    offset: section.seed,
  };
  const segments = createTaperedCurlSegments(parent, spec);
  return segments;
}

const segmentateMandible: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const curve = (section.angle < 0) ? -10 : 10;
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size / 100,
    taperFactor: 0.8,
    angle: section.angle,
    overlapMult: 0.5,
    offset: section.seed,
  }
  const segments = createMandibleSegments(parent, spec, 5, 1, curve);
return segments;
}

const segmentateFeeler: SegmentationFunc = (
  parent: Segment,
  section: Section,
  _processSection: SegmentationFunc): Segment[] => {
const spec: TaperedSegmentSpec = {
  count: section.length,
  radius: parent.circle.radius * section.size / 100,
  taperFactor: 0.9,
  angle: section.angle,
  overlapMult: 0.2,
  offset: section.seed,
}
const segments = createRigidSegment(parent, spec);
return segments;
}

/* LOWER LEVEL SECTION-CREATION FUNCTIONS */

function generateNewtLegs(parentIndex: number): Section {
  return {
    type: 'legs',
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

/* LOWER LEVEL HELPER & SEGMENT-CREATION FUNCTIONS */

type TaperedSegmentSpec = {
  count: number;
  radius: number;
  taperFactor: number;
  angle: number;
  overlapMult: number;
  offset: number;
}

function createTaperedCurlSegments(parent: Segment, spec: TaperedSegmentSpec): Segment[] {
  const segments = createTaperedSegments(parent, spec);
  segments.forEach((segment, i) => {
    segment.wriggle = generateCompositeWriggle([generateCurlSpec(120/spec.count, 2, i, spec.offset)]);
  });
  return segments;
}

function createTadpoleSegments(parent: Segment, spec: TaperedSegmentSpec): Segment[] {
  const tailStart = spec.count / 3;
  const speedTransformation = (angle: number, speed: number): number => {
    return angle * (1 - speed / 50);
  };
  const segments = createTaperedSegments(parent, spec);
  segments.forEach((segment, i) => {
    const squiggleRange = (i >= tailStart) ? 20 : 10;
    const squiggleSpec = generateSquiggleSpec(squiggleRange, 3, i, spec.count*2)
    squiggleSpec.speedTransformation = speedTransformation;
    segment.wriggle = generateCompositeWriggle([squiggleSpec]);
    segment.bodyAngle.curveRange = 20;
  });
  return segments;
}

function createLegSegments(parent: Segment, spec: TaperedSegmentSpec): Segment[] {
  const segments = createTaperedSegments(parent, spec);
  let speedAdd = 0;
  if (spec.angle < 0) speedAdd = 18
  if (spec.angle > 0) speedAdd = -18
  const speedTransformation = (angle: number, speed: number): number => {
    return angle * (100 - speed) / 100 + speedAdd * speed / 100;
  };
  segments.forEach((segment, i) => {
    const squiggleSpec = generateSquiggleSpec(10, 3, i, spec.count*2);
    squiggleSpec.speedTransformation = speedTransformation;
    segment.wriggle = generateCompositeWriggle([squiggleSpec]);
    segment.bodyAngle.curveRange = 25;
  });
  return segments;
}

function createMandibleSegments(
    parent: Segment,
    spec: TaperedSegmentSpec,
    angle: number,
    period: number,
    curve: number): Segment[] {
  const segments = createRotationSegments(parent, spec, angle, period);
  segments.forEach((segment, i) => {
    segment.bodyAngle.relative += i * curve;
  });
  return segments;
}

function createRigidSegment(
  parent: Segment,
  spec: TaperedSegmentSpec): Segment[] {
  const segments = createTaperedSegments(parent, spec);
  segments.forEach((segment) => {
    segment.bodyAngle.curveRange = 0;
  });
  return segments;
}

function createRotationSegments(
    parent: Segment,
    spec: TaperedSegmentSpec,
    angle: number,
    period: number): Segment[] {
  const generateWriggleSpec = (_: number) => [generateRotationSpec(angle, period, spec.offset)];
  const segments = createTaperedSegments(parent, spec, generateWriggleSpec);
  segments.forEach((segment) => {
    segment.bodyAngle.curveRange = 0;
  });
  return segments;
}

function createTaperedSegments(
    parent: Segment,
    spec: TaperedSegmentSpec,
    generateWriggleSpec: (i: number) => WriggleSpec[] = (_: number) => [] ): Segment[] {
  const segments = [];
  let curr = parent;
  let radius = spec.radius;
  for (let i=0; i < spec.count; i++) {
    radius = radius * spec.taperFactor;
    const next = createDefaultSegment(radius);
    next.bodyAngle.relative = spec.angle;
    next.bodyAngle.curveRange = 360 / spec.count;
    next.wriggle = generateCompositeWriggle(generateWriggleSpec(i)),
    next.overlap = radius * spec.overlapMult;
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };