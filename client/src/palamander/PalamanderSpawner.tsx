import Palamander from './Palamander.tsx'
import { SegmentCircle, Segment } from './segment.ts'

function createDummySegmentCircle(radius: number): SegmentCircle {
  return {
    radius: radius,
    center: {
      x: 0,
      y: 0
    }
  }
}

function createDummySegment(radius: number): Segment {
  return {
    circle: createDummySegmentCircle(radius),
    angle: { fromParent: 0 },
    children: []
  }
}

// Convenience Component for describing Palamander Segment trees and behavior.
// For development / iteration only - Palamanders will ultimately be defined by:
// 1. data configs
// 2. server-side random generation code
function PalamanderSpawner() {
  const spawnCircle: SegmentCircle  = {
    radius: 0,
    center: {
      x: 400,
      y: 300
    }
  };

  const head = createDummySegment(20);
  let curr = head;

  for (let i=0; i<10; i++) {
    const next = createDummySegment(10);
    curr.children.push(next);
    curr = next;
  }

  return (
    <>
      <Palamander initialSegment={head} spawnCircle={spawnCircle}/>
    </>
  )
}

export default PalamanderSpawner