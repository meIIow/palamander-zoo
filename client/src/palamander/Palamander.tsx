import { useEffect, useState } from 'react'
import SegmentView from './SegmentView.tsx'
import { Circle, Coordinate, createEngineCircle, generateUpdateCircle } from './circle.ts'
import { Segment, updateSegment, hydrateSegment, getSegmentCircles } from './segment.ts'
import getPlaceholderMovementAgent from './movement-agent.ts';

type PalamanderProps = {
  segment: Segment,
  spawnCoord: Coordinate,
}

function Palamander({ segment, spawnCoord }: PalamanderProps) {
  const [head, setHead] = useState(
    () => hydrateSegment(segment, createEngineCircle(segment.circle), 0, Date.now())
  );

  function animate(
      angle: number,
      engineCircle: Circle,
      currTime: number,
      interval: number,
      speed: number) {
    setHead((head: Segment) => {
      return updateSegment(head, engineCircle, angle, angle, currTime, interval, speed);
    });
  }

  useEffect(() => {
    const movementAgent = getPlaceholderMovementAgent();
    const updateEngine = generateUpdateCircle(createEngineCircle(segment.circle));
    let prevTime = Date.now();
    const intervalId = setInterval(() => {
      const currTime = Date.now();
      const interval = currTime-prevTime;
      const movement = movementAgent.move(interval);
      const engineCircle = updateEngine(movement.delta);
      animate(movement.angle, engineCircle, currTime, interval, movement.speed);
      prevTime = currTime;
    }, 50); // 20 FPS
    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <>
      {getSegmentCircles(head).map((circle, i) => <SegmentView circle={circle} spawn={spawnCoord} key={i}/>)}
    </>
  )
}

export default Palamander