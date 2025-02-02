import { SampleSpec } from './sample';

function generateMeasuredSampleSpec(): SampleSpec {
  return {
    range: {
      min: 200,
      max: 5000,
      skewMin: 3,
    },
    zero: 0,
    mirror: false,
  };
}

function generateCommittedSampleSpec(): SampleSpec {
  return {
    range: {
      min: 500,
      max: 5000,
      skewMin: 1,
    },
    zero: 0,
    mirror: false,
  };
}

function generateFreneticSampleSpec(): SampleSpec {
  return {
    range: {
      min: 200,
      max: 2000,
      skewMin: 4,
    },
    zero: 0,
    mirror: false,
  };
}

export {
  generateMeasuredSampleSpec,
  generateCommittedSampleSpec,
  generateFreneticSampleSpec,
};
