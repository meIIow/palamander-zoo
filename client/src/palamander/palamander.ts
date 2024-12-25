import { createEngineCircle, generateUpdateCircle } from './common/circle.ts'
import { Segment, updateSegment } from './morphology/segment.ts'
import { MovementAgent } from './movement/movement-agent.ts';

type Palamander = {
  head: Segment;
  updateInterval: number;
  movementAgent: MovementAgent;
  magnification: number; // pixels per 100 Pal Units
};

type AnimationFunc = (update: (head: Segment) => Segment) => void;

const initializeUpdateLoop = (pal: Palamander, animate: AnimationFunc ): NodeJS.Timeout => {
  const movementAgent = pal.movementAgent;
  const updateEngine = generateUpdateCircle(createEngineCircle(pal.head.circle));
  let prevTime = Date.now();
  return setInterval(() => {
    const currTime = Date.now();
    const interval = currTime-prevTime;
    const movement = movementAgent.move(interval);
    const engineCircle = updateEngine(movement.delta);
    animate((head: Segment) => {
      return updateSegment(head, engineCircle, movement.angle, movement.angle, currTime, interval, movement.speed);
    });
    prevTime = currTime;
  }, pal.updateInterval);
};

export { initializeUpdateLoop }; 
export type { Palamander };