import { BehaviorMap, VelocityBehaviorSpecGenerator, VelocityLimit } from './velocity-behavior.ts';
import { SampleSpec } from './movement-sample.ts';
import { generateDefaultIntervalSampleSpec } from './interval-behavior.ts';

const placeholderLimit: VelocityLimit = {
  velocity: 720,
  accel: 1440,
  decel: 1440,
}

const placeholderRotation: SampleSpec = {
  range: {
    min: 0,
    max: 100,
    skewMin: 2,
  },
  zero: 0.15,
  mirror: true,
};

const generatePlaceholderRotationBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: placeholderLimit,
    velocity: placeholderRotation,
    interval: generateDefaultIntervalSampleSpec(interval)
  }
}

export const rotationMap: BehaviorMap = {
  'placeholder': generatePlaceholderRotationBehaviorSpec,
  // 'coiling': generateCoilingBehaviorSpec,
  // 'onward': generateOnwardBehaviorSpec,
  // 'twirling': generateTwirlingbehaviorSpec,
  // 'wary': generateWaryBehaviorSpec,
};