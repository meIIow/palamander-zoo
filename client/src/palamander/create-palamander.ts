import { Coordinate, SegmentCircle, Segment } from './segment.ts'
import { generatePropagatedWiggle, generateLinearWiggle, noWiggle, generateSynchronizedWiggle } from './wiggle.ts'

function createEmptyCoordinate(): Coordinate {
  return {
    x: 0,
    y: 0,
  };
}

function createEmptyCircle(radius: number): SegmentCircle {
  return {
    radius,
    center: createEmptyCoordinate(),
  }
}

function createEngineCircle(head: SegmentCircle, spawn: Coordinate): SegmentCircle {
  return {
    radius: -1 * head.radius,
    center: spawn,
  }
}

function createFocalSegment(radius: number, propagationInterval: number = 100): Segment {
  return {
    circle: createEmptyCircle(radius),
    bodyAngle: {
      relative: 0,
      absolute: 0,
      curveRange: 0,
    },
    wiggle: noWiggle,
    overlap: 0,
    propagationInterval: propagationInterval,
    children: [],
  }
}

function addLeg(parent: Segment, radius: number, length: number, angle: number, offset: number): void {
  let curr = parent
  for (let i=0; i < length; i++) {
    const next: Segment = {
      circle: createEmptyCircle(radius),
      bodyAngle: {
        relative: angle,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      wiggle: generateLinearWiggle(45, 2*length, offset),
      overlap: 0,
      children: [],
    }
    curr.children.push(next);
    curr = next;
  }
}

function addSpike(parent: Segment, radius: number, length: number, angle: number): void {
  let curr = parent
  const taper = radius / length;
  for (let i=0; i < length; i++) {
    const next: Segment = {
      circle: createEmptyCircle(radius),
      bodyAngle: {
        relative: angle,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      wiggle: noWiggle,
      overlap: 0,
      children: [],
    }
    curr.children.push(next);
    curr = next;
    radius -= taper
  }
}

function addOctoArm(
    curr: Segment,
    radius: number,
    taperFactor: number,
    length: number,
    angle: number,
    offset: number): void {
  for (let i=0; i < length; i++) {
    radius = radius * taperFactor;
    const next: Segment = {
      circle: createEmptyCircle(radius),
      bodyAngle: {
        relative: angle,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      //wiggle: noWiggle,
      wiggle: generateSynchronizedWiggle(120 / length, 2*length, i, offset),
      overlap: radius / 2,
      children: [],
    };
    curr.children.push(next);
    curr = next;
  }
}
function addTaperedSnake(curr: Segment, length: number, radius: number, taperFactor: number, angle: number, overlapMult: number = 0) {
  for (let i=0; i<length; i++) {
    radius = radius * taperFactor
    const next: Segment = {
      circle: createEmptyCircle(radius),
      bodyAngle: {
        relative: angle,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      wiggle: generatePropagatedWiggle(10, 2*length, i),
      overlap: overlapMult * radius,
      children: []
    }
    curr.children.push(next);
    curr = next;
  }
  return curr;
}

function addFrill(curr: Segment, length: number, radius: number, angle: number) {
  for (let i=0; i<length; i++) {
    radius = radius
    const next: Segment = {
      circle: createEmptyCircle(radius),
      bodyAngle: {
        relative: i == 0 ? angle : 0,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      wiggle: generatePropagatedWiggle(10, 10*length, i),
      overlap: 0,
      children: []
    }
    curr.children.push(next);
    curr = next;
  }
  return curr;
}

function generateUpdateCircle(circle: SegmentCircle) {
  return (delta: Coordinate) => {
    return {
      radius: circle.radius,
      center: {
        x: circle.center.x + delta.x,
        y: circle.center.y + delta.y,
      }
    }
  }
}

function createTadpole(): Segment {
  const head = createFocalSegment(20);
  addTaperedSnake(head, 10, 15, 0.9, 0);
  return head;
}

function createCentipede() {
  const head = createFocalSegment(13);
  let curr = head;
  for (let i=0; i < 10; i++) {
    const next: Segment = {
      circle: createEmptyCircle(10),
      bodyAngle: {
        relative: 0,
        absolute: 0,
        curveRange: 100,
      },
      propagationInterval: 100,
      wiggle: generatePropagatedWiggle(10, 20, i),
      overlap: 0,
      children: []
    };
    addLeg(next, 1, 5, 80, i);
    addLeg(next, 1, 5, -80, i);
    curr.children.push(next);
    curr = next;
  }
  return head;
}

function createHorseshoeCrab() {
  const head = createFocalSegment(40);
  const body = createFocalSegment(30);

  body.overlap = 30;
  addSpike(body, 3, 5, 0);
  head.children.push(body);
  return head;
}

function createCrawdad() {
  const head = createFocalSegment(30);
  let curr = head;
  for (const r of [22, 18, 15]) {
    const next = createFocalSegment(r);
    next.overlap = r;
    addLeg(next, 2, 5, 90, 0);
    addLeg(next, 2, 5, -90, 0);
    curr.children.push(next);
    curr = next;
  }
  const tail = createFocalSegment(13);
  tail.overlap = 13;
  const leftTailScale = createFocalSegment(15);
  leftTailScale.bodyAngle.relative = 45;
  leftTailScale.overlap = 15;
  const rightTailScale = createFocalSegment(15);
  rightTailScale.bodyAngle.relative = -45;
  rightTailScale.overlap = 15;
  curr.children.push(leftTailScale);
  curr.children.push(rightTailScale);
  return head;
}

function createNewt() {
  const head = createFocalSegment(20);
  addTaperedSnake(head, 15, 10, 0.95, 0, 0.5);
  let curr = head;
  curr = curr.children[0];
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, 45, 0.5);
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, -45, 0.5);

  for (let i=0; i<2; i++) {
    curr = curr.children[0];
  }
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, 45, 0.5);
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, -45, 0.5);

  return head;
}

function createJelly() {
  const head = createFocalSegment(40);
  const frillCount = 3;
  for (let i=0; i<2*frillCount+1; i++) {
    const angle = 10 * (i-frillCount-1);
    addFrill(head, 8, 2, angle);
  }
  for (let i=0; i<2*frillCount+1; i++) {
    const angle = 5 * (i-frillCount-1);
    addFrill(head, 16, 2, angle);
  }
  for (let i=0; i<2*frillCount+1; i++) {
    const angle = 2 * (i-frillCount-1);
    addFrill(head, 24, 2, angle);
  }
  return head;
}

function createOctopus() {
  const head = createFocalSegment(40);
  for (let i=0; i<6; i++) {
    const angle = 8 + 16 * (i-3);
    addOctoArm(head, 15, 0.90, 12, angle, 29 * i % 17);
  }
  return head;
}

function createStarfish() {
  const head = createFocalSegment(20);
  for (let i=0; i<5; i++) {
    const angle = 180 + 72 * i;
    addOctoArm(head, 15, 0.90, 8, angle, 0);
  }
  return head;
}

function createAxolotl() {
  const head = createFocalSegment(20);
  addTaperedSnake(head, 15, 10, 0.95, 0, 0.5);
  let curr = head;
  curr = curr.children[0];
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, 45, 0.5);
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, -45, 0.5);

  for (let i=0; i<2; i++) {
    curr = curr.children[0];
  }
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, 45, 0.5);
  addTaperedSnake(curr, 5, curr.circle.radius / 2, 0.9, -45, 0.5);

  for (let i=0; i<6; i++) {
    const angle = 30 + 60 * i;
    addOctoArm(head, 2, 0.9, 5, angle, 0);
  }

  return head;
}

export {
  createEngineCircle,
  generateUpdateCircle,
  createTadpole,
  createCentipede,
  createJelly,
  createOctopus,
  createStarfish,
  createHorseshoeCrab,
  createNewt,
  createCrawdad,
  createAxolotl
};