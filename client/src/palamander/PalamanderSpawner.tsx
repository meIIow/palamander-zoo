import Palamander from './Palamander.tsx'
import { Coordinate, SegmentCircle, Segment } from './segment.ts'
import { generatePropagatedWiggle, noWiggle } from './wiggle.ts'

function createDummySegmentCircle(radius: number): SegmentCircle {
  return {
    radius: radius,
    center: {
      x: 0,
      y: 0
    }
  }
}

function createEngineSegmentCircle(offset: Coordinate): SegmentCircle {
  return {
    radius: -20,
    center: {
      x: 400 + offset.x,
      y: 300 + offset.y
    }
  }
}

function createDummySegment(radius: number, total: number, segment: number): Segment {
  return {
    circle: createDummySegmentCircle(radius),
    angle: {
      offParent: 0,
      absolute: 0,
    },
    wiggle: generatePropagatedWiggle(10, 2*total, segment),
    children: []
  }
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const spawnCircle = createEngineSegmentCircle({x: 0, y: 0});

  const head = createDummySegment(20, 1, 0);
  head.wiggle = noWiggle;
  let curr = head;

  for (let i=0; i<10; i++) {
    const next = createDummySegment(10, 10, i);
    curr.children.push(next);
    curr = next;
  }

  return (
    <>
      <Palamander initialSegment={head} spawnCircle={spawnCircle}/>
    </>
  )
}

export { PalamanderSpawner, createEngineSegmentCircle }