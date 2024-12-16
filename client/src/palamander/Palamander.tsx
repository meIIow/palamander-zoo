import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { SegmentCircle, Segment, updateSegment, hydrateSegment, getSegmentCircles } from './segment.ts'
import { generateUpdateCircle } from './create-palamander.ts';
import MovementAgent from './movement-agent.ts';

type PalamanderProps = {
  initialSegment: Segment,
  spawnCircle: SegmentCircle,
}

function Palamander({ initialSegment, spawnCircle }: PalamanderProps) {
  const [head, setHead] = useState(() => hydrateSegment(initialSegment, spawnCircle, 0, Date.now()));

  function animate(
      angle: number,
      anglePrev: number,
      engineCircle: SegmentCircle,
      currTime: number,
      interval: number) {
    setHead((head) => {
      return updateSegment(head, engineCircle, angle, anglePrev, currTime, interval)
    });
  }

  useEffect(() => {
    const movementAgent = new MovementAgent(10, 5);
    const updateEngine = generateUpdateCircle(spawnCircle);
    let anglePrev = 0;
    let prevTime = Date.now();
    const intervalId = setInterval(() => {
      const movement = movementAgent.move();
      const engineCircle = updateEngine(movement.delta);
      const currTime = Date.now();
      animate(movement.angle, anglePrev, engineCircle, currTime, currTime-prevTime);
      anglePrev = movement.angle;
      prevTime = currTime;
    }, 50);
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <>
      {getSegmentCircles(head).map((circle, i) => <SegmentView circle={circle} key={i}/>)}
    </>
  )
}

export default Palamander