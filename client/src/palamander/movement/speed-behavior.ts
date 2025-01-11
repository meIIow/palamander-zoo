import { BehaviorMap, VelocityBehaviorSpecGenerator, VelocityLimit } from './velocity-behavior.ts';
import { SampleSpec } from './movement-sample.ts';
import { generateMeasuredSampleSpec, generateCommittedSampleSpec, generateFreneticSampleSpec } from './interval-behavior.ts';

const BASELINE_VELOCITY = 2500; // 25 (Pal Units / Second), ~ 2-10 (pal lengths / sec)
const BASELINE_ACCEL = 1000; // 10 (Pal Units / Second), ~ 1-4 (pal lengths / sec)
const BASELINE_DECEL = 2000; // 20 (Pal Units / Second), ~ 2-8 (pal lengths / sec)

const baselineLimit: VelocityLimit = {
  velocity: BASELINE_VELOCITY,
  accel: BASELINE_ACCEL,
  decel: BASELINE_DECEL,
}

const defaultSpeedSampleSpec: SampleSpec = {
  range: {
    min: 0,
    max: 100,
    skewMin: 2,
  },
  zero: 0.15,
  mirror: false,
};

const generateDefaultSpeedBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: baselineLimit,
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

// Slower across the board, and with extra low distribution.
const generateCautiousBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 3;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

// Slower across the board.
const generateDeliberateBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.2 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

// Faster speed, even slightly faster acc/dec, more speed changing.
const generateErraticBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.15 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY * 1.5,
      accel: BASELINE_ACCEL,
      decel: BASELINE_DECEL,
    },
    velocity,
    interval: generateFreneticSampleSpec(interval)
  }
}

const generateFlittingBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  return {
    limit: baselineLimit,
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

// Never fully stopped, with slow speed and slower acc/dec, less speed changing.
const generateFloatingBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0 };
  velocity.range.skewMin = 1;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 3,
      accel: BASELINE_ACCEL / 5,
      decel: BASELINE_ACCEL / 5,
    },
    velocity,
    interval: generateCommittedSampleSpec(interval)
  }
}

// Slower speed & acc/dec, with extra stopping chance.
const generateHoveringBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 2,
      accel: BASELINE_ACCEL / 3,
      decel: BASELINE_DECEL / 3,
    },
    velocity,
    interval: generateMeasuredSampleSpec(interval)
  }
}

// Slower across the board, but with higher distribution.
const generatePushingBehaviorSpec: VelocityBehaviorSpecGenerator = (
  _velocity: number, interval: number
) => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.2 };
  velocity.range.skewMin = 1;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(interval)
  }
}

export const speedMap: BehaviorMap = {
  'placeholder': generateDefaultSpeedBehaviorSpec,
  'cautious': generateCautiousBehaviorSpec,
  // 'dashing': generateDashingBehaviorSpec,
  'deliberate': generateDeliberateBehaviorSpec,
  'erratic': generateErraticBehaviorSpec,
  'flitting': generateFlittingBehaviorSpec,
  'floating': generateFloatingBehaviorSpec,
  'hovering': generateHoveringBehaviorSpec,
  'pushing': generatePushingBehaviorSpec,
};