import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { Circle, generateUpdateCircle } from './circle.ts'
import { Segment, updateSegment, hydrateSegment, getSegmentCircles } from './segment.ts'
import getPlaceholderMovementAgent from './movement-agent.ts';

type PalamanderProps = {
  segment: Segment,
  spawnCircle: Circle,
}

function Palamander({ segment, spawnCircle }: PalamanderProps) {
  const [head, setHead] = useState(() => hydrateSegment(segment, spawnCircle, 0, Date.now()));

  function animate(
      angle: number,
      engineCircle: Circle,
      currTime: number,
      interval: number,
      speed: number) {
    setHead((head) => {
      return updateSegment(head, engineCircle, angle, angle, currTime, interval, speed);
    });
  }

  useEffect(() => {
    const movementAgent = getPlaceholderMovementAgent();
    const updateEngine = generateUpdateCircle(spawnCircle);
    let prevTime = Date.now();
    const intervalId = setInterval(() => {
      const currTime = Date.now();
      const interval = currTime-prevTime;
      const movement = movementAgent.move(interval);
      const engineCircle = updateEngine(movement.delta);
      console.log(movement.speedPercent)
      animate(movement.angle, engineCircle, currTime, interval, movement.speedPercent);
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