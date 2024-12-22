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
  const body = generateTaperedSqiggleSegments(head, section.length, section.size, 0.95, 0, 0.5)
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
  const segments = generateTaperedSqiggleSegments(parent, section.length, parent.circle.radius * section.size, 0.9, section.angle, 0.5);
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
  const segments = generateTaperedCurlSegments(parent, section.length, section.size, 0.9, section.angle, section.seed);
  return segments;
}

/* LOWER LEVEL HELPER & SEGMENT-CREATION FUNCTIONS */

function generateTaperedSqiggleSegments(
    parent: Segment,
    length: number,
    radius: number,
    taperFactor: number,
    angle: number,
    overlapMult: number = 0): Segment[] {
  const segments = [];
  let curr = parent;
  for (let i=0; i<length; i++) {
    radius = radius * taperFactor
    const next = createDefaultSegment(radius);
    next.wriggle = generateCompositeWriggle([generateSquiggleSpec(10, 1, i, length*2)]),
    next.bodyAngle.relative = angle;
    next.overlap = overlapMult * radius,
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

function generateTaperedCurlSegments(
    curr: Segment,
    length: number,
    radius: number,
    taperFactor: number,
    angle: number,
    offset: number): Segment[] {
  const segments = [];
  for (let i=0; i < length; i++) {
    radius = radius * taperFactor;
    const next = createDefaultSegment(radius);
    next.bodyAngle.relative = angle;
    next.wriggle = generateCompositeWriggle([generateCurlSpec(120/length, 2, i, offset)]),
    next.overlap = radius / 2;
    curr.children.push(next);
    curr = next;
    segments.push(curr);
  }
  return segments;
}

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

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };