import {
  BehaviorMap,
  VelocitySampleSpecGenerator,
  wrapBehaviorMap,
} from './velocity-behavior.ts';
import { VelocityLimit, VelocitySampleSpec } from './velocity.ts';
import { SampleSpec } from './sample.ts';
import {
  generateMeasuredSampleSpec,
  generateCommittedSampleSpec,
  generateFreneticSampleSpec,
} from './interval-behavior.ts';

const BASELINE_VELOCITY = 2500; // 25 (Pal Units / Second)
const BASELINE_ACCEL = 50; // 50% Speed / Second
const BASELINE_DECEL = 200; // 200% Speed / Second

const baselineLimit: VelocityLimit = {
  velocity: BASELINE_VELOCITY,
  accel: BASELINE_ACCEL,
  decel: BASELINE_DECEL,
};

const defaultSpeedSampleSpec: SampleSpec = {
  range: {
    min: 0,
    max: 100,
    skewMin: 2,
  },
  zero: 0.15,
  mirror: false,
};

const generateDefaultSpeedBehaviorSpec: VelocitySampleSpecGenerator = () => {
  return {
    limit: baselineLimit,
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(),
  };
};

// Slower across the board, and with extra low distribution.
const generateCautiousBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 3;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

// Slower across the board.
const generateDeliberateBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.2 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

// Faster speed, even slightly faster acc/dec, more speed changing.
const generateErraticBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.15 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY * 1.5,
      accel: BASELINE_ACCEL,
      decel: BASELINE_DECEL,
    },
    velocity,
    interval: generateFreneticSampleSpec(),
  };
};

const generateFlittingBehaviorSpec: VelocitySampleSpecGenerator = () => {
  return {
    limit: baselineLimit,
    velocity: defaultSpeedSampleSpec,
    interval: generateMeasuredSampleSpec(),
  };
};

// Never fully stopped, with slow speed and slower acc/dec, less speed changing.
const generateFloatingBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0 };
  velocity.range.skewMin = 1;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 5,
      accel: BASELINE_ACCEL / 8,
      decel: BASELINE_ACCEL / 8,
    },
    velocity,
    interval: generateCommittedSampleSpec(),
  };
};

// Slower speed & acc/dec, with extra stopping chance.
const generateHoveringBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 2;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 2,
      accel: BASELINE_ACCEL / 3,
      decel: BASELINE_DECEL / 3,
    },
    velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

// Slower across the board, but with higher distribution.
const generatePredatoryBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.4 };
  velocity.range.skewMin = 0;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

// Slower across the board, but with higher distribution.
const generatePushingBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultSpeedSampleSpec, zero: 0.2 };
  velocity.range.skewMin = 1;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL / 1.5,
      decel: BASELINE_DECEL / 1.5,
    },
    velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

const speedMap: BehaviorMap = {
  placeholder: generateDefaultSpeedBehaviorSpec,
  cautious: generateCautiousBehaviorSpec,
  // 'dashing': generateDashingBehaviorSpec,
  deliberate: generateDeliberateBehaviorSpec,
  erratic: generateErraticBehaviorSpec,
  flitting: generateFlittingBehaviorSpec,
  floating: generateFloatingBehaviorSpec,
  hovering: generateHoveringBehaviorSpec,
  predatory: generatePredatoryBehaviorSpec,
  pushing: generatePushingBehaviorSpec,
};

export const mapSpeedBehavior = (behavior: string): VelocitySampleSpec => {
  return wrapBehaviorMap(speedMap, behavior);
};
