import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { SegmentCircle, SegmentSpec, updateSegment, hydrateSegment, getSegmentCircles } from './segment.ts'
import { generateUpdateCircle } from './create-palamander.ts';
import getPlaceholderMovementAgent from './movement-agent.ts';

type PalamanderProps = {
  segmentSpec: SegmentSpec,
  spawnCircle: SegmentCircle,
}

function Palamander({ segmentSpec, spawnCircle }: PalamanderProps) {
  const [head, setHead] = useState(() => hydrateSegment(segmentSpec, spawnCircle, 0, Date.now()));

  function animate(
      angle: number,
      engineCircle: SegmentCircle,
      currTime: number,
      interval: number) {
    setHead((head) => {
      return updateSegment(head, engineCircle, angle, angle, currTime, interval)
    });
  }

  useEffect(() => {
    const movementAgent = getPlaceholderMovementAgent(); // placeholder pixel speed of 50
    const updateEngine = generateUpdateCircle(spawnCircle);
    let prevTime = Date.now();
    const intervalId = setInterval(() => {
      const currTime = Date.now();
      const interval = currTime-prevTime;
      const movement = movementAgent.move(interval);
      const engineCircle = updateEngine(movement.delta);
      animate(movement.angle, engineCircle, currTime, interval);
      prevTime = currTime;
    }, 50); // 20 FPS
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <>
      {getSegmentCircles(head).map((circle, i) => <SegmentView circle={circle} key={i}/>)}
    </>
  )
}

export default Palamander