import { BehaviorMap, VelocityBehaviorSpecGenerator, VelocityLimit } from './velocity-behavior.ts';
import { SampleSpec } from './movement-sample.ts';
import { generateMeasuredSampleSpec, generateFreneticSampleSpec, generateCommittedSampleSpec } from './interval-behavior.ts';

const BASELINE_VELOCITY = 720; // 3 rotations / sec
const BASELINE_ACCEL = 1440; // (full velocity in one direction to the other) / sec

const baselineLimit: VelocityLimit = {
  velocity: BASELINE_VELOCITY,
  accel: BASELINE_ACCEL,
  decel: BASELINE_ACCEL,
}

const defaultRotationSampleSpec: SampleSpec = {
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
    limit: baselineLimit,
    velocity: defaultRotationSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

const generateCoilingBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultRotationSampleSpec };
  velocity.range.skewMin = 1;
  return {
    limit: { velocity: BASELINE_VELOCITY * 1.5, accel: BASELINE_ACCEL * 3, decel: BASELINE_ACCEL * 3 },
    velocity: velocity,
    interval: generateFreneticSampleSpec(interval)
  }
}

const generateTwirlingBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: { ...baselineLimit, accel: BASELINE_ACCEL * 2, decel: BASELINE_ACCEL * 2 },
    velocity: defaultRotationSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

const generateCuriousBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: { velocity: BASELINE_VELOCITY / 1.5, accel: BASELINE_ACCEL, decel: BASELINE_ACCEL },
    velocity: defaultRotationSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

const generateOnwardBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultRotationSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 3;
  return {
    limit: { velocity: BASELINE_VELOCITY / 4, accel: BASELINE_ACCEL / 4, decel: BASELINE_ACCEL / 4 },
    velocity: velocity,
    interval: generateCommittedSampleSpec(interval)
  }
}

const generateWaryBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultRotationSampleSpec, zero: 0.3 };
  return {
    limit: { velocity: BASELINE_VELOCITY / 4, accel: BASELINE_ACCEL / 2, decel: BASELINE_ACCEL / 2 },
    velocity: velocity,
    interval: generateMeasuredSampleSpec(interval)
  }
}

export const rotationMap: BehaviorMap = {
  'placeholder': generatePlaceholderRotationBehaviorSpec,
  'coiling': generateCoilingBehaviorSpec,
  'onward': generateOnwardBehaviorSpec,
  'twirling': generateTwirlingBehaviorSpec,
  'curious': generateCuriousBehaviorSpec,
  'wary': generateWaryBehaviorSpec,
};