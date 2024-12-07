import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { SegmentCircle, Segment, updateSegment, getSegmentCircles } from './segment.ts'
import { createEngineSegmentCircle } from './PalamanderSpawner.tsx';

type PalamanderProps = {
  initialSegment: Segment,
  spawnCircle: SegmentCircle,
}

function Palamander({ initialSegment, spawnCircle }: PalamanderProps) {
  const [head, setHead] = useState(updateSegment(initialSegment, spawnCircle, 0, 0));

  function animate(count: number, angle: number, engineSegmentCircle: SegmentCircle) {   
    setHead((head) => {
      console.log("animating!")
      // const wiggleIntensity = Math.sin(count * Math.PI / 10); // 10 is a somewhat arbitraty hard-coded value
      return updateSegment(head, engineSegmentCircle, angle, count)
    });
    console.log(console.timeLog());
  }

  useEffect(() => {
    let count = 1;
    const intervalId = setInterval(() => {
      //const engineSegmentCircle = createEngineSegmentCircle(offset);
      const engineSegmentCircle = createEngineSegmentCircle({x:0,y:0});


      count += 1
      animate(count, 0, engineSegmentCircle);
    }, 100);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <>
      {getSegmentCircles(head).map(circle => <SegmentView circle={circle} />)}
    </>
  )
}

export default Palamander