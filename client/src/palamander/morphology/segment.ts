import { Wriggle, WriggleSpec, generateCompositeWriggle } from './wriggle.ts';
import { Circle, calculateCenter, createDefaultCircle } from '../common/circle.ts';

type BodyAngle = {
  // Overall body angle at this segment
  // Trails that of ancestor segments, since a turn will propagate down at some rate
  absolute: number;
  // Max diff b/w parent and segment body absolute angle.
  // Higher for more flexible sections (jellyfish tentacles) than rigid ones (spine, carapace)
  curveRange: number;
  // Relative angle off of absolute body angle to render this segment
  // Ex: 0 for spine, 30 for arm
  relative: number;
}

type SegmentSpec = {
  radius: number;
  bodyAngle: BodyAngle;
  wriggle: Array<WriggleSpec>;
  overlap: number;
  propagationInterval: number;
  children: Array<SegmentSpec>;
};

// Represents one segment of a Palamander.
//
// Contains:
// 1. The circle to render, which can change each update based on the Palamander's movement
// 2. The persistant data that define its relationship to its parent segment (angle, etc)
// 3. How to adjust the parent angle to simulate wriggling/curling/squiggling
// 4. How close to render this segment to its parent. At overlap 0, the circles are tangent.
// 5. Downstream segments, defined as recursive tree from this segment
type Segment = {
  circle: Circle;
  bodyAngle: BodyAngle;
  wriggle: Wriggle;
  overlap: number;
  propagationInterval: number;
  children: Array<Segment>;
};

// We calculate the absolute body angle for this segment from:
// 1. previous absolute body angle of this segment
// 2. prevous absolute body angle of parent
// 3. current absolute body angle of parent
//
// Each segment has a propagation interval.
// This is the amount of time it takes this segment to take on the absolute body angle of its parent.
// Think of a salamander spine - the whole thing doesn't spin like a hinge when its turns...
//    instead, the turn travels down its body as it swings (over time) to match the new direction.
//
// If exactly the propagation interval has passed, this angle will be exactly what the parent was.
// If less time has passed, the angle should be b/w where this segment and its parent were
// If more time has passed, the angle should be b/w where its parent is and was
function calculateAbsoluteBodyAngle(
  stepMagnitude: number,
  absoluteBodyAnglePrev: number,
  parentAbsoluteBodyAnglePrev: number,
  parentAbsoluteBodyAngle: number,
): number {
  return stepMagnitude < 1 ?
    stepMagnitude*parentAbsoluteBodyAnglePrev + (1-stepMagnitude)*absoluteBodyAnglePrev :
    (parentAbsoluteBodyAnglePrev + (stepMagnitude-1)*parentAbsoluteBodyAngle) / stepMagnitude;
}

// Adjust segment's absolute body angle to be within acceptable range of parent's
function clipAbsoluteBodyAngle(
  curveRange: number,
  absoluteBodyAngle: number,
  parentAbsoluteBodyAngle: number,
): number {
  if (parentAbsoluteBodyAngle - absoluteBodyAngle > curveRange) {
    return absoluteBodyAngle = parentAbsoluteBodyAngle-curveRange;
  }
  if (absoluteBodyAngle - parentAbsoluteBodyAngle > curveRange) {
    return absoluteBodyAngle = parentAbsoluteBodyAngle+curveRange;
  }
  return absoluteBodyAngle;
}

function updateBodyAngle(
  stepMagnitude: number,
  parentAbsoluteBodyAnglePrev: number,
  parentAbsoluteBodyAngle: number,
  bodyAnglePrev: BodyAngle
): BodyAngle {
  let absoluteBodyAngle = calculateAbsoluteBodyAngle(
    stepMagnitude,
    bodyAnglePrev.absolute,
    parentAbsoluteBodyAnglePrev,
    parentAbsoluteBodyAngle
  );

  const bodyAngle = {...bodyAnglePrev}
  bodyAngle.absolute =
      clipAbsoluteBodyAngle(bodyAngle.curveRange, absoluteBodyAngle, parentAbsoluteBodyAngle)
  return bodyAngle;
}

// Initialize segments with consistent spawn data 
function hydrateSegment(
    segment: Segment,
    parentCircle: Circle,
    bodyAngleAbsolute: number,
    updateTime: number,
    depth = 0): Segment {
  const circle = {
    center: calculateCenter(
      segment.circle,
      parentCircle,
      segment.overlap,
      bodyAngleAbsolute + segment.bodyAngle.relative + segment.wriggle(updateTime/100, 0)),
    radius: segment.circle.radius
  }
  const bodyAngle = {...segment.bodyAngle}
  bodyAngle.absolute = bodyAngleAbsolute;
  return {
    circle,
    bodyAngle,
    wriggle: segment.wriggle,
    overlap: segment.overlap,
    propagationInterval: segment.propagationInterval,
    children: segment.children.map(
      (child) => hydrateSegment(child, circle, bodyAngleAbsolute, updateTime, depth+1)
    )
  }
}

function updateSegment(
    segment: Segment,
    parentCircle: Circle,
    parentAbsoluteBodyAngle: number,
    parentAbsoluteBodyAnglePrev: number,
    updateTime: number,
    interval: number,
    speed: number): Segment {
  const stepMagnitude = interval / segment.propagationInterval;
  const bodyAngle = updateBodyAngle(
    stepMagnitude,
    parentAbsoluteBodyAnglePrev,
    parentAbsoluteBodyAngle,
    segment.bodyAngle
  );
  const circle = {
    center: calculateCenter(
      segment.circle,
      parentCircle,
      segment.overlap,
      bodyAngle.absolute + bodyAngle.relative + segment.wriggle(updateTime, speed)),
    radius: segment.circle.radius
  }
  return {
    circle,
    bodyAngle,
    wriggle: segment.wriggle,
    overlap: segment.overlap,
    propagationInterval: segment.propagationInterval,
    children: segment.children.map((child) => {
      return updateSegment(
        child,
        circle,
        bodyAngle.absolute,
        segment.bodyAngle.absolute,
        updateTime,
        interval,
        speed
      );
    })
  }
}

function getSegmentCircles(segment: Segment): Array<Circle> {
  return [segment.circle, ...segment.children.map(child => getSegmentCircles(child)).flat()]
}

function createDefaultSegment(radius: number, propagationInterval: number = 100): Segment {
  return {
    circle: createDefaultCircle(radius),
    bodyAngle: {
      relative: 0,
      absolute: 0,
      curveRange: 0,
    },
    wriggle: generateCompositeWriggle([]),
    overlap: 0,
    propagationInterval: propagationInterval,
    children: [],
  }
}

function createSegment(
    radius: number,
    angle: number,
    overlapMult: number,
    propagationInterval: number = 100): Segment {
  const segment = createDefaultSegment(radius, propagationInterval);
  segment.bodyAngle.relative = angle;
  segment.overlap = radius * overlapMult;
  return segment;
}

export { updateSegment, hydrateSegment, getSegmentCircles, createDefaultSegment, createSegment };
export type { Segment, SegmentSpec };
