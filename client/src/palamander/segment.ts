type Coordinate = {
  x: number;
  y: number;
}

type SegmentCircle = {
  radius: number;
  center: Coordinate;
}

type SegmentAngle = {
  fromParent: number;
}

// Represents one segment of a Palamander.
//
// Contains:
// 1. The circle to render, which changes each update
// 2. The persistant data that define its relationship to its parent segment (angle, etc)
// 3. Downstream segments, defined as recursive tree from this segment
type Segment = {
  circle: SegmentCircle;
  angle: SegmentAngle;
  children: Array<Segment>;
};

function calculateCenter(segment: Segment, parentCircle: SegmentCircle): Coordinate {
  const xd = Math.sin(segment.angle.fromParent * Math.PI / 180) * (segment.circle.radius + parentCircle.radius);
  const yd = Math.cos(segment.angle.fromParent * Math.PI / 180) * (segment.circle.radius + parentCircle.radius);
  return {
    x: parentCircle.center.x+xd,
    y: parentCircle.center.y+yd
  }
}

function updateSegment(segment: Segment, parentCircle: SegmentCircle): Segment {
  const circle = {
    center: calculateCenter(segment, parentCircle),
    radius: segment.circle.radius
  }
  const angle = {...segment.angle}
  return {
    circle,
    angle,
    children: segment.children.map((child) => updateSegment(child, circle))
  }
}

function getSegmentCircles(segment: Segment): Array<SegmentCircle> {
  return [segment.circle, ...segment.children.map(child => getSegmentCircles(child)).flat()]
}

export { updateSegment, getSegmentCircles };
export type { SegmentCircle, Segment };
