import { Wiggle } from './wiggle.ts'

type Coordinate = {
  x: number;
  y: number;
}

type SegmentCircle = {
  radius: number;
  center: Coordinate;
}

type SegmentAngle = {
  offParent: number;
  absolute: number;
}

// Represents one segment of a Palamander.
//
// Contains:
// 1. The circle to render, which can change each update based on the Palamander's movement
// 2. The persistant data that define its relationship to its parent segment (angle, etc)
// 3. How to adjust the parent angle to simulate wiggling/curling/squiggling
// 4. Downstream segments, defined as recursive tree from this segment
type Segment = {
  circle: SegmentCircle;
  angle: SegmentAngle;
  wiggle: Wiggle;
  children: Array<Segment>;
};


function calculateCenter(segmentCircle: SegmentCircle, parentCircle: SegmentCircle, angle: number): Coordinate {
  const xd = Math.sin(angle * Math.PI / 180) * (segmentCircle.radius + parentCircle.radius);
  const yd = Math.cos(angle * Math.PI / 180) * (segmentCircle.radius + parentCircle.radius);
  return {
    x: parentCircle.center.x+xd,
    y: parentCircle.center.y+yd
  }
}

function updateSegment(segment: Segment, parentCircle: SegmentCircle, absoluteAngleParent: number, count: number): Segment {
  const absoluteAngle = absoluteAngleParent + segment.wiggle(count);
  const circle = {
    center: calculateCenter(segment.circle, parentCircle, absoluteAngle),
    radius: segment.circle.radius
  }
  const angle = {...segment.angle}
  angle.absolute = absoluteAngleParent;
  return {
    circle,
    angle,
    wiggle: segment.wiggle,
    children: segment.children.map((child) => updateSegment(child, circle, segment.angle.absolute, count))
  }
}

function getSegmentCircles(segment: Segment): Array<SegmentCircle> {
  return [segment.circle, ...segment.children.map(child => getSegmentCircles(child)).flat()]
}

export { updateSegment, getSegmentCircles };
export type { Coordinate, SegmentCircle, Segment };
