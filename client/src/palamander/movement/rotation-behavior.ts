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
} from './interval-behavior.ts';

const BASELINE_VELOCITY = 720; // 3 rotations / second
const BASELINE_ACCEL = 800; // 8x (full turn -> straight / second)

const baselineLimit: VelocityLimit = {
  velocity: BASELINE_VELOCITY,
  accel: BASELINE_ACCEL,
  decel: BASELINE_ACCEL,
};

const defaultRotationSampleSpec: SampleSpec = {
  range: {
    min: 0,
    max: 100,
    skewMin: 2,
  },
  zero: 0.15,
  mirror: true,
};

const generatePlaceholderRotationBehaviorSpec: VelocitySampleSpecGenerator =
  () => {
    return {
      limit: baselineLimit,
      velocity: defaultRotationSampleSpec,
      interval: generateMeasuredSampleSpec(),
    };
  };

const generateCoilingBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultRotationSampleSpec, zero: 0.08 };
  velocity.range.skewMin = 1;
  return {
    limit: {
      velocity: BASELINE_VELOCITY * 0.75,
      accel: BASELINE_ACCEL / 4,
      decel: BASELINE_ACCEL / 4,
    },
    velocity: velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

const generateTwirlingBehaviorSpec: VelocitySampleSpecGenerator = () => {
  return {
    limit: {
      ...baselineLimit,
      accel: BASELINE_ACCEL * 2,
      decel: BASELINE_ACCEL * 2,
    },
    velocity: defaultRotationSampleSpec,
    interval: generateMeasuredSampleSpec(),
  };
};

const generateCuriousBehaviorSpec: VelocitySampleSpecGenerator = () => {
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 1.5,
      accel: BASELINE_ACCEL,
      decel: BASELINE_ACCEL,
    },
    velocity: defaultRotationSampleSpec,
    interval: generateMeasuredSampleSpec(),
  };
};

const generateOnwardBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultRotationSampleSpec, zero: 0.3 };
  velocity.range.skewMin = 3;
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 4,
      accel: BASELINE_ACCEL / 4,
      decel: BASELINE_ACCEL / 4,
    },
    velocity: velocity,
    interval: generateCommittedSampleSpec(),
  };
};

const generateWaryBehaviorSpec: VelocitySampleSpecGenerator = () => {
  const velocity = { ...defaultRotationSampleSpec, zero: 0.3 };
  return {
    limit: {
      velocity: BASELINE_VELOCITY / 4,
      accel: BASELINE_ACCEL / 2,
      decel: BASELINE_ACCEL / 2,
    },
    velocity: velocity,
    interval: generateMeasuredSampleSpec(),
  };
};

const rotationMap: BehaviorMap = {
  placeholder: generatePlaceholderRotationBehaviorSpec,
  coiling: generateCoilingBehaviorSpec,
  onward: generateOnwardBehaviorSpec,
  twirling: generateTwirlingBehaviorSpec,
  curious: generateCuriousBehaviorSpec,
  wary: generateWaryBehaviorSpec,
};

export const mapRotationBehavior = (behavior: string): VelocitySampleSpec => {
  return wrapBehaviorMap(rotationMap, behavior);
};
