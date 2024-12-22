import { Segment, createDefaultSegment } from "./segment";
import { Section } from "./section";
import { generateCompositeWriggle, generateSquiggleSpec } from './wriggle';

// A function that breaks down a given Section into its component Segments.
type SegmentationFunc = (parent: Segment, section: Section, segmentate: SegmentationFunc) => Segment[];

interface SegmentationMap {
  [key: string]: SegmentationFunc;
}

function getDefaultSegmentationMap(): SegmentationMap{
  return {
      'newt': segmantateNewt,
      'tadpole': segmentateTadpole,
      'leg': segmentateLeg,
    }
}

/* TOP-LEVEL SEGMENTATION FUNCTIONS */

const segmantateNewt: SegmentationFunc = (
    parent: Segment,
    section: Section,
    processSection: SegmentationFunc): Segment[] => {
  const sectionTree = {...section};
  sectionTree.type = 'tadpole';
  sectionTree.children = [
    generateNewtLegSection(1, true),
    generateNewtLegSection(1, false),
    generateNewtLegSection(3, true),
    generateNewtLegSection(3, false)
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

const segmentateLeg: SegmentationFunc = (
  parent: Segment,
  section: Section,
  _processSection: SegmentationFunc): Segment[] => {
const segments = generateTaperedSqiggleSegments(parent, section.length, parent.circle.radius * section.size, 0.9, section.angle, 0.5);
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

function generateNewtLegSection(parentIndex: number, mirror: boolean): Section {
  return {
    type: 'leg',
    parentIndex,
    length: 5,
    size: 0.5,
    angle: mirror ? -45: 45,
    children: []
  };
}

export type { SegmentationFunc, SegmentationMap };
export { getDefaultSegmentationMap };