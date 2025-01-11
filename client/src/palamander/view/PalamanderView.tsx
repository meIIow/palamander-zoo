import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { createEngineCircle } from '../common/circle.ts'
import { shift } from '../common/coords.ts'
import { hydrateSegment, getSegmentCircles } from '../morphology/segment.ts'
import { Palamander, initializeUpdateLoop, calculateFractionalCoordinates, getBodySegments } from '../palamander.ts'

type PalamanderProps = {
  pal: Palamander,
}

function PalamanderView({ pal }: PalamanderProps) {
  const [state, setState] = useState(() => {
    const head = hydrateSegment(pal.body[0], createEngineCircle(pal.body[0].circle), 0, Date.now());
    return {
      head,
      delta: { x: 0, y: 0 },
      pivot: calculateFractionalCoordinates(getBodySegments(head), pal.pivotIndex),
    };
  });

  useEffect(() => {
    // Initialize loop that triggers new render by updating the 'head' Segment state.
    const intervalId = initializeUpdateLoop(pal, setState);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, [pal]);

  pal.range.sync();
  return (
    <>
      {getSegmentCircles(state.head).map((circle, i) => {
        return (<SegmentView
          circle={{ ...circle, center: shift(circle.center, state.delta)}}
          range={pal.range}
          color='teal'
          key={i}
        />)
      })}
    </>
  )
}

export default PalamanderView