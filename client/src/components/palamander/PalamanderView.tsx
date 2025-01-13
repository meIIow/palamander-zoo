import './PalamanderView.css'
import { useEffect, useState, useRef } from 'react'
import SegmentView from './SegmentView.tsx'
import { createEngineCircle } from '../../palamander/common/circle.ts'
import { shift } from '../../palamander/common/coords.ts'
import { hydrateSegment, getSegmentCircles } from '../../palamander/morphology/segment.ts'
import { Palamander, initializeUpdateLoop, calculateFractionalCoordinates, getBodySegments } from '../../palamander/palamander.ts'
import { DisplayRange } from '../../palamander/palamander-range.ts'

type PalamanderProps = {
  pal: Palamander,
  display: DisplayRange,
}

function PalamanderView({ pal, display }: PalamanderProps) {
  const divRef: React.MutableRefObject<null | HTMLDivElement> = useRef(null);
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

  if (divRef.current != null) display.setRange(divRef.current.getBoundingClientRect());
  return (
    <>
      <div ref={divRef} className="palamander">
        {divRef.current == null ? null : getSegmentCircles(state.head).map((circle, i) => {
          return (<SegmentView
            circle={{ ...circle, center: shift(circle.center, state.delta)}}
            display={display}
            magnification={pal.magnificaiton}
            key={i}
          />)
        })}
      </div>
    </>
  )
}

export default PalamanderView