import { Segment, createDefaultSegment } from "./segment";
import { Section , createEmptySection, createPassthruSection, toPassthruChild } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec, generateCurlSpec } from './wriggle';

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
      'leg': segmentateLeg,
      'legs': segmentateLegs,
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
  const head = createDefaultSegment(20);
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: section.size,
    taperFactor: 0.95,
    angle: 0,
    overlapMult: 0.5,
    offset: 0
  }
  const body = createTadpoleSegments(head, spec);
  return [ head, ...body];
}

const segmentateLegs: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const passthru = createPassthruSection();
  passthru.children = [
    {...section, type: 'leg', parentIndex: 0},
    {...section, type: 'leg', parentIndex: 0},
  ];
  passthru.children[1].angle *= -1;

  return processSection(parent, passthru, processSection);
}

const segmentateLeg: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: parent.circle.radius * section.size,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    offset: 0
  }
  const segments = createLegSegments(parent, spec);
  return segments;
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

const segmentateGill: SegmentationFunc = (
    parent: Segment,
    section: Section,
    _processSection: SegmentationFunc): Segment[] => {
  const spec: TaperedSegmentSpec = {
    count: section.length,
    radius: section.size,
    taperFactor: 0.9,
    angle: section.angle,
    overlapMult: 0.5,
    offset: section.seed,
  };
  const segments = createTaperedCurlSegments(parent, spec);
  return segments;
}

/* LOWER LEVEL SECTION-CREATION FUNCTIONS */

function generateNewtLegs(parentIndex: number): Section {
  createEmptySection()
  return {
    type: 'legs',
    parentIndex,
    length: 5,
    size: 0.5,
    angle: 45,
    seed: 0,
    children: []
  };
}

function generateGills(): Section {
  return {
    type: 'gills',
    parentIndex: 0,
    length: 5,
    size: 2,
    angle: 60,
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

function createTaperedSegments(parent: Segment, spec: TaperedSegmentSpec): Segment[] {
  const segments = [];
  let curr = parent;
  let radius = spec.radius;
  for (let i=0; i < spec.count; i++) {
    radius = radius * spec.taperFactor;
    const next = createDefaultSegment(radius);
    next.bodyAngle.relative = spec.angle;
    next.wriggle = generateCompositeWriggle([]),
    next.overlap = radius * spec.overlapMult;
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };