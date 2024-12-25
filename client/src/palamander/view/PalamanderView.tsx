import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { Coordinate, createEngineCircle } from '../common/circle.ts'
import { hydrateSegment, getSegmentCircles } from '../morphology/segment.ts'
import { Palamander, initializeUpdateLoop } from '../palamander.ts'

type PalamanderProps = {
  pal: Palamander,
  spawnCoord: Coordinate,
}

function PalamanderView({ pal, spawnCoord }: PalamanderProps) {
  const [head, setHead] = useState(
    () => hydrateSegment(pal.head, createEngineCircle(pal.head.circle), 0, Date.now())
  );

  useEffect(() => {
    // Initialize loop that triggers new render by updating the 'head' Segment state.
    const intervalId = initializeUpdateLoop(pal, setHead);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <>
      {getSegmentCircles(head).map((circle, i) => <SegmentView circle={circle} spawn={spawnCoord} magnification={pal.magnification} key={i}/>)}
    </>
  )
}

export default PalamanderView