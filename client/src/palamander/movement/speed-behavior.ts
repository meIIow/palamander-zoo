import { BehaviorMap, VelocityBehaviorSpecGenerator, VelocityLimit } from './velocity-behavior.ts';
import { SampleSpec } from './movement-sample.ts';
import { generateDefaultIntervalSampleSpec } from './interval-behavior.ts';

const defaultLimit: VelocityLimit = {
  velocity: 2500,
  accel: 1000,
  decel: 2000,
}

const defaultSpeed: SampleSpec = {
  range: {
    min: 0,
    max: 100,
    skewMin: 2,
  },
  zero: 0.15,
  mirror: false,
};

const generatePlaceholderSpeedBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: defaultLimit,
    velocity: defaultSpeed,
    interval: generateDefaultIntervalSampleSpec(interval)
  }
}

export const speedMap: BehaviorMap = {
  'placeholder': generatePlaceholderSpeedBehaviorSpec,
  // 'cautious': generateCautiousBehaviorSpec,
  // 'dashing': generateDashingBehaviorSpec,
  // 'deliberate': generateDeliberateBehaviorSpec,
  // 'erratic': generateErraticBehaviorSpec,
  // 'floating': generateFloatingBehaviorSpec,
  // 'hovering': generateHoveringBehaviorSpec,
};