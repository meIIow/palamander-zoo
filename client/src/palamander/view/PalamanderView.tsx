import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { createEngineCircle } from '../common/circle.ts'
import { hydrateSegment, getSegmentCircles } from '../morphology/segment.ts'
import { Palamander, initializeUpdateLoop } from '../palamander.ts'

type PalamanderProps = {
  pal: Palamander,
}

function PalamanderView({ pal }: PalamanderProps) {
  const [head, setHead] = useState(
    () => hydrateSegment(pal.head, createEngineCircle(pal.head.circle), 0, Date.now())
  );

  useEffect(() => {
    // Initialize loop that triggers new render by updating the 'head' Segment state.
    const intervalId = initializeUpdateLoop(pal, setHead);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, [pal]);

  pal.range.sync();
  return (
    <>
      {getSegmentCircles(head).map((circle, i) => {
        return <SegmentView circle={circle} range={pal.range} key={i} />
      })}
    </>
  )
}

export default PalamanderView